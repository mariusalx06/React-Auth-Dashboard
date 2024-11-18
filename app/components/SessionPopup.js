"use client";
import styles from "@/app/components/SessionPopup.module.css";

export default function SessionPopup(props) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      props.buttonAction();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.messageContainer}>
        <p>{props.displayText}</p>

        {props.displayText2 && <p>{props.displayText2}</p>}

        {props.showPasswordInput && (
          <>
            <input
              type="password"
              value={props.password}
              onChange={props.onPasswordChange}
              placeholder="Enter your password"
              autoFocus
              onKeyDown={handleKeyDown} // Handle Enter key press
            />
            {props.errorMessage && (
              <p className={styles.error}>{props.errorMessage}</p>
            )}
          </>
        )}

        <button onClick={props.buttonAction}>{props.buttonText}</button>

        {props.buttonText2 && (
          <button className={styles.redButton} onClick={props.buttonAction2}>
            {props.buttonText2}
          </button>
        )}

        {props.remainingTime && <p>{props.remainingTime} seconds</p>}
      </div>
    </div>
  );
}
