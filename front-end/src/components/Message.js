import styles from "./Message.module.css";
import { FaRobot, FaUser } from "react-icons/fa";

export default function Message({ role, content }) {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.icon}>
        {role === "assistant" ? <FaRobot size={30} /> : <FaUser size={30} />}
      </div>
      <div className={`${styles.messageBubble} ${role === "assistant" ? styles.assistant : styles.user}`}>
        <p>{content}</p>
      </div>
    </div>
  );
}
