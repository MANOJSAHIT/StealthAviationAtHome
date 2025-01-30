import { FaPaperclip } from "react-icons/fa";
import styles from "./Input.module.css";

export default function Input({ value, onChange, onClick, onFileUpload, onEnter }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onEnter();
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        type="text"
        placeholder="Enter your message..."
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        className={styles.inputField}
      />

      {/* Pin icon for file upload */}
      <label htmlFor="file-upload" className={styles.pinIcon}>
        <FaPaperclip size={24} />
      </label>
      <input
        id="file-upload"
        type="file"
        style={{ display: "none" }}
        onChange={onFileUpload}
      />

      <button onClick={onClick} className={styles.sendButton}>
        Send
      </button>
    </div>
  );
}
