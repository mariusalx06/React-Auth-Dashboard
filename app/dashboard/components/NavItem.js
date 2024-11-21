import styles from "./NavItem.module.css";
import { useRouter } from "next/navigation";

export default function NavItem(props) {
  const router = useRouter();
  const handleClick = () => {
    router.push(props.href);
  };

  return (
    <div className={styles.item}>
      <button className={styles.opennedButton} onClick={handleClick}>
        <props.Icon className={styles.icon} />

        {props.text && <p className={styles.text}>{props.text}</p>}
      </button>
    </div>
  );
}
