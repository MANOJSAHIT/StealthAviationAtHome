# **AI-Powered Chat Application with LangChain Integration**

This project is a full-stack AI-powered chat application built using **ReactJS** for the frontend and **Flask** for the backend, leveraging **LangChain** for conversation memory management. The application supports dynamic model selection between **OpenAI's GPT-4** and **Anthropic's Claude 3.5 Sonnet**, with the ability to handle PDF file uploads and maintain conversation context.

---

## **Features**
- 💬 **AI Conversations:** Engage in intelligent conversations powered by **GPT-4** or **Claude 3.5 Sonnet**.
- 🔄 **Conversation Memory:** Preserve context across multiple interactions using LangChain’s memory.
- 📂 **File Upload:** Upload PDF files to enrich the conversation context with file content.
- 🛠️ **Dynamic Model Selection:** Switch between GPT-4 and Claude before starting a conversation.
- 🔒 **Model Locking:** Lock model selection once a conversation begins, ensuring consistency.
- 💾 **Saved Conversations:** Easily load past conversations and continue from where you left off.
- 🌐 **Responsive UI:** Clean, minimal, and intuitive user interface.

---

## **Backend Setup**

### **Prerequisites**
The backend requires the following dependencies:

```plaintext
flask==3.0.0
flask-cors==4.0.0
werkzeug==3.0.1
langchain==0.1.0
langchain-anthropic==0.0.4
openai==1.3.0
python-dotenv==1.0.0
PyPDF2==3.0.1



**Clone the repository**
git clone https://github.com/MANOJSAHIT/StealthAviationAtHome.git
cd StealthAviationAtHome/backend

**Set up a virtual environment:**
python -m venv venv
source venv/bin/activate  # For Windows, use `venv\\Scripts\\activate`

**Install dependencies:**
pip install -r requirements.txt

**Environment setup:**
The .env file is already included and configured with the necessary API keys:
OPENAI_API_KEY=your_openai_api_key
CLAUDE_API_KEY=your_claude_api_key

**Run the backend server:**

python app.py
Frontend Setup

**Navigate to the frontend directory:**
cd ../frontend

**Install dependencies:**
npm install  # or `yarn install`

**Run the frontend:**
npm start  # or `yarn start`
The application will be available at http://localhost:3000.

**Project Structure**
StealthAviationAtHome
├── backend
│   ├── .env                  # API keys configuration
│   ├── app.py                # Flask backend server
│   └── requirements.txt      # Backend dependencies
├── frontend
│   ├── node_modules          # Frontend dependencies
│   ├── public                # Static assets
│   ├── src                   # React source files
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Global styles for the application
│   │   ├── components        # Reusable components
│   │   │   ├── Clear.js
│   │   │   ├── Clear.module.css
│   │   │   ├── History.js
│   │   │   ├── History.module.css
│   │   │   ├── Message.js
│   │   │   ├── Message.module.css
│   │   │   ├── Input.js
│   │   │   └── Input.module.css
└── README.md                 # Project documentation

**Usage Instructions**

1) Select the desired model (either GPT-4 or Claude 3.5 Sonnet) from the dropdown menu.
2) Enter a system prompt to guide the AI on how to respond throughout the conversation.
💡 Note: The first prompt in every conversation is considered a system prompt that sets the tone or context for the conversation, and it will not receive a direct response.
3) Optionally, upload PDF files to incorporate their content into the conversation.
4) Engage in a conversation and save your progress for future sessions.
5) Start a new conversation using the “Save and Start New Conversation” button.

Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

**Technologies Used**
ReactJS: Frontend user interface
Flask: Backend API
LangChain: Conversation memory and model management
OpenAI: GPT-4 model integration
Anthropic: Claude 3.5 Sonnet integration
PyPDF2: Extracting text from uploaded PDF files
