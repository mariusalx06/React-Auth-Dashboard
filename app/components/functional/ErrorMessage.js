import React, { useEffect, useState } from "react";
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage(props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      if (props.onClose) {
        props.onClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [props.message]);

  if (!visible) return null;

  return (
    <div className={styles.errorMessage}>
      <p>{props.message}</p>
      <button className={styles.closeButton} onClick={props.onClose}>
        &times;
      </button>
    </div>
  );
}
