import { useState, useEffect } from "react";
import Message from "./components/Message";
import Input from "./components/Input";
import "./App.css";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [savedConversations, setSavedConversations] = useState(() => {
    const saved = localStorage.getItem("savedConversations");
    return saved ? JSON.parse(savedConversations) : [];
  });
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSystemPrompt, setIsSystemPrompt] = useState(true);
  const [selectedModel, setSelectedModel] = useState("GPT-4");  
  const [modelLocked, setModelLocked] = useState(false);  

  useEffect(() => {
    const initializeConversation = async () => {
      const response = await fetch("http://localhost:5000/api/start_conversation", {
        method: "POST",
      });
      const data = await response.json();
      setConversationId(data.conversation_id);
    };

    if (!conversationId) {
      initializeConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const handleModelChange = (e) => {
    if (!modelLocked) {
      setSelectedModel(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (!conversationId) {
      alert("Conversation not initialized properly. Please try again.");
      return;
    }

    const userMessage = { role: "user", content: input, isSystemPrompt: isSystemPrompt };

    setMessages([...messages, userMessage]);
    setInput("");

    if (isSystemPrompt) {
      setIsSystemPrompt(false);
      setModelLocked(true);  
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      uploadedFiles.forEach((file) => formData.append("files", file));
      formData.append("conversation_id", conversationId);
      formData.append("user_input", input);
      formData.append("model", selectedModel);  

      const response = await fetch("http://localhost:5000/api/chat_with_files", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const assistantMessage = { role: "assistant", content: data.response };

      setMessages((prev) => [...prev, assistantMessage]);
      setUploadedFiles([]);
      setFileUploaded(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF files are allowed.");
      return;
    }

    setUploadedFiles((prev) => [...prev, file]);
    setFileUploaded(true);
    setErrorMessage("");
  };

  const saveAndStartNewConversation = async () => {
    const timestamp = new Date().toLocaleString();

    if (currentConversationIndex !== null) {
      const updatedConversations = [...savedConversations];
      updatedConversations[currentConversationIndex].messages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      updatedConversations[currentConversationIndex].title = `Updated at ${timestamp}`;
      setSavedConversations(updatedConversations);
      localStorage.setItem("savedConversations", JSON.stringify(updatedConversations));
      alert("Conversation updated!");
    } else {
      const newConversation = {
        id: conversationId,
        title: `Conversation at ${timestamp}`,
        messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      };
      setSavedConversations((prev) => [...prev, newConversation]);
      localStorage.setItem("savedConversations", JSON.stringify([...savedConversations, newConversation]));
      alert("Conversation saved!");
    }

    setMessages([]);
    setUploadedFiles([]);
    setIsSystemPrompt(true);
    setModelLocked(false);  
    const response = await fetch("http://localhost:5000/api/start_conversation", {
      method: "POST",
    });
    const data = await response.json();
    setConversationId(data.conversation_id);
    setCurrentConversationIndex(null);
  };

  const loadConversation = (conversation, index) => {
    setMessages(conversation.messages);
    setConversationId(conversation.id);
    setCurrentConversationIndex(index);
    setIsSystemPrompt(conversation.messages.length === 0);
  };

  return (
    <div className="App">
      <div className="Sidebar">
        <h3>Saved Conversations</h3>
        {savedConversations.map((conversation, index) => (
          <div key={conversation.id} className="ConversationItem" onClick={() => loadConversation(conversation, index)}>
            {conversation.title}
          </div>
        ))}
      </div>

      <div className="Main">
        <div className="Header">
          <label htmlFor="modelSelect">Select Model:</label>
          <select id="modelSelect" value={selectedModel} onChange={handleModelChange} disabled={modelLocked}>
            <option value="GPT-4">GPT-4</option>
            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
          </select>
        </div>

        <div className="Content">
          {messages.map((el, i) => (
            <div key={i} className="MessageWrapper">
              <Message role={el.role} content={el.content} />
            </div>
          ))}
          {loading && <div className="Loader">...</div>}
          {fileUploaded && <div className="FileIndicator"><FaCheckCircle color="green" /> File Uploaded</div>}
          {errorMessage && <div className="ErrorIndicator">{errorMessage}</div>}
        </div>

        <Input
          isSystemPrompt={isSystemPrompt}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
          onFileUpload={handleFileUpload}
          onEnter={input ? handleSubmit : undefined}
        />

        <button onClick={saveAndStartNewConversation} className="SaveButton">Save and Start New Conversation</button>
      </div>
    </div>
  );
}
