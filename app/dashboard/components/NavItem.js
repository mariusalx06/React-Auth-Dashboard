import styles from "./NavItem.module.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function NavItem(props) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === props.href;

  const handleClick = () => {
    if (props.target === "_blank") {
      window.open(props.href, "_blank");
    } else {
      router.push(props.href);
    }
  };

  const buttonClass = props.isSidebarOpen
    ? styles.opennedButton
    : styles.closedButton;

  return (
    <div className={styles.item}>
      <button
        className={`${buttonClass} ${isActive ? styles.active : ""}`}
        onClick={handleClick}
        title={props.inactive ? "This option is currently unavailable" : ""}
      >
        <props.Icon className={styles.icon} />

        {props.text && <p className={styles.text}>{props.text}</p>}
      </button>
    </div>
  );
}
