"use client";
import styles from "@/app/components/SessionPopup.module.css";

export default function Alert(props) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      buttonAction();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.messageContainer}>
        <p>{props.displayText}</p>
        <button onClick={props.buttonAction} onKeyDown={handleKeyDown}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
}
