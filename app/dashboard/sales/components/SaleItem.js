import { useState } from "react";
import styles from "./SaleItem.module.css";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";

export default function SaleItem({ sale }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={`${styles.saleItem} ${isExpanded ? styles.expanded : ""}`}>
      <button className={styles.toggleButton} onClick={toggleExpansion}>
        {isExpanded ? <ZoomInMapIcon /> : <ZoomOutMapIcon />}
      </button>

      <div className={styles.saleDetails}>
        <p>
          <strong>Order:</strong> {sale.order_id}
        </p>
        <p>
          <strong>Agent ID:</strong> {sale.agentid}
        </p>
        <p>
          <strong>Customer ID:</strong> {sale.customer_id}
        </p>
      </div>

      {isExpanded && (
        <div className={styles.saleItemInfo}>
          <div className={styles.saleDetails}>
            <p>
              <strong>Old Price:</strong> ${sale.old_price}
            </p>
            <p>
              <strong>New Price:</strong> ${sale.new_price}
            </p>
            <p>
              <strong>Device Code:</strong> {sale.device_code}
            </p>
          </div>
          <div className={styles.saleDetails}>
            <p>
              <strong>Customer Satisfaction:</strong>{" "}
              {sale.customer_satisfaction}
            </p>
            <p>
              <strong>Date of Renewal:</strong>{" "}
              {new Date(sale.date_of_renewal).toLocaleDateString()}
            </p>
            <p>
              <strong>CED:</strong> {sale.ced}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
