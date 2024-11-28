"use client";

import React from "react";
import styles from "./CardItem.module.css";
import { useSession } from "next-auth/react";

export default function CardItem(props) {
  const { data: session, status } = useSession();

  function handleClick() {
    console.log("I got clicked");
    console.log(session);
  }

  return (
    <div className={styles.cardContainer}>
      {props.type === "device" ? (
        <>
          <h2 className={styles.cardTitle}>{props.title}</h2>

          <hr className={styles.cardHr} />

          <h2 className={styles.cardPrice}>{props.price}</h2>
        </>
      ) : props.type === "plan" ? (
        <>
          <div className={styles.cardTitleContainer}>
            <h2 className={styles.cardTitle}>{props.title}</h2>
            <span className={styles.rounded5G}>5G</span>
          </div>

          <hr className={styles.cardHr} />

          <h2 className={styles.cardPrice}>
            {props.price}
            <span className={styles.monthText}>/month</span>
          </h2>
        </>
      ) : (
        <span>No valid data</span>
      )}

      <ul className={styles.cardList}>
        {props.type === "device" ? (
          <>
            <li className={styles.cardListItem}>{props.manufacturer}</li>
            <li className={styles.cardListItem}>{props.deviceModel}</li>
            <li className={styles.cardListItem}>{props.sellingPrice}</li>
            <li className={styles.cardListItem}>5G Ready</li>
          </>
        ) : props.type === "plan" ? (
          <>
            <li className={styles.cardListItem}>
              {props.internetLimit} Internet
            </li>
            <li className={styles.cardListItem}>
              {props.voiceLimit} National Minutes
            </li>
            <li className={styles.cardListItem}>
              {props.smsLimit} National SMS
            </li>
            <li className={styles.cardListItem}>
              {props.internetRoamingLimit} Roaming Internet
            </li>
            <li className={styles.cardListItem}>5G Ready</li>
          </>
        ) : (
          <span>No valid data</span>
        )}
        <button
          className={`${styles.cardBtn} ${styles.cardBtnEdit}`}
          onClick={handleClick}
        >
          Edit
        </button>
      </ul>
    </div>
  );
}
