import styles from "./LoadingSales.module.css"; // Import your CSS module for styling

export default function LoadingSales() {
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.spinner}></div>
      <p>Loading sales...</p>
    </div>
  );
}
