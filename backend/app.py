import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')
claude_api_key = os.getenv('ANTHROPIC_API_KEY')

gpt4_model = ChatOpenAI(model="gpt-4", temperature=0.7, openai_api_key=openai_api_key)
claude_model = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0,max_tokens=1024, anthropic_api_key=claude_api_key)

memory_store = {}

@app.route('/api/start_conversation', methods=['POST'])
def start_conversation():
    import uuid
    conversation_id = str(uuid.uuid4())
    memory_store[conversation_id] = ConversationBufferMemory()
    return jsonify({"conversation_id": conversation_id})

@app.route('/api/chat_with_files', methods=['POST'])
def chat_with_files():
    try:
        conversation_id = request.form.get('conversation_id')
        user_input = request.form.get('user_input')
        model = request.form.get('model', 'GPT-4')  

        if not user_input or not conversation_id:
            return jsonify({"error": "User input and conversation ID are required"}), 400

        if conversation_id not in memory_store:
            memory_store[conversation_id] = ConversationBufferMemory()

        memory = memory_store[conversation_id]

        if 'files' in request.files:
            for file in request.files.getlist('files'):
                file_content = process_file(file)
                memory.chat_memory.add_user_message(f"File content from {file.filename}: {file_content}")

        if model == "Claude 3.5 Sonnet":
            conversation = ConversationChain(llm=claude_model, memory=memory)
        else:
            conversation = ConversationChain(llm=gpt4_model, memory=memory)

        response = conversation.predict(input=user_input)
        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

def process_file(file):
    """Process uploaded PDF files to extract their text content."""
    from PyPDF2 import PdfReader
    import tempfile

    if file.content_type == "application/pdf":
        try:
            with tempfile.NamedTemporaryFile(delete=True) as temp_file:
                file.save(temp_file.name)
                reader = PdfReader(temp_file.name)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() or ""
                return text.strip()
        except Exception as e:
            return f"Error processing PDF: {str(e)}"
    else:
        return "Unsupported file type."

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
