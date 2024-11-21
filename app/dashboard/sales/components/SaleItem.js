// components/SaleItem.js
import styles from "./SaleItem.module.css";

export default function SaleItem({ sale }) {
  return (
    <div className={styles.saleItem}>
      <div className={styles.saleTitle}>Order ID: {sale.order_id}</div>

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
            <strong>Customer Satisfaction:</strong> {sale.customer_satisfaction}
          </p>
          <p>
            <strong>Date of Renewal:</strong>{" "}
            {new Date(sale.date_of_renewal).toLocaleDateString()}
          </p>
          <p>
            <strong>CED:</strong> {sale.ced}
          </p>
        </div>
        <div className={styles.saleDetails}>
          <p>
            <strong>Customer ID:</strong> {sale.customer_id}
          </p>
        </div>
      </div>
    </div>
  );
}
