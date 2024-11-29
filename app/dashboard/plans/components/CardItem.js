import React, { useState } from "react";
import axios from "axios";
import styles from "./CardItem.module.css";
import Loading from "./Loading";

export default function CardItem(props) {
  const [editCard, setEditCard] = useState({
    plan_name: props.planName,
    plan_price: props.price,
    internet_data_limit_mb: props.internetLimit,
    voice_minutes_limit: props.voiceLimit,
    sms_limit: props.smsLimit,
    internet_roaming_data_limit_mb: props.internetRoamingLimit,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditCard((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleToggleEdit() {
    setIsEditMode(true);
  }

  function handleCancel() {
    setIsEditMode(false);
    setEditCard({
      plan_name: props.planName,
      plan_price: props.price,
      internet_data_limit_mb: props.internetLimit,
      voice_minutes_limit: props.voiceLimit,
      sms_limit: props.smsLimit,
      internet_roaming_data_limit_mb: props.internetRoamingLimit,
    });
  }

  async function handleSave() {
    setIsLoading(true);

    try {
      const response = await axios.put(`/api/pricePlans/${props.id}`, editCard);

      if (response.status === 201) {
        setIsEditMode(false);
        setIsLoading(false);
        props.onSuccess();
      } else {
        alert(response.data.errorMessage);
        setIsEditMode(false);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
          props.onError(
            `Unauthorized Access: ${
              data.errorMessage ||
              "You are not authorized to perform this action."
            }`
          );
        } else if (status === 500) {
          props.onError(
            `Server Issue: ${
              data.errorMessage ||
              "There was an issue with the server. Please try again later."
            }`
          );
        } else {
          props.onError(
            `Error: ${
              data.errorMessage || "An unknown error occurred."
            } (Code: ${status})`
          );
        }
      } else {
        props.onError(
          "Error submitting form. Please check your connection or try again."
        );
      }
      setIsLoading(false);
      setIsEditMode(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);

    try {
      const response = await axios.delete(`/api/pricePlans/${props.id}`);

      if (response.status === 201) {
        setIsEditMode(false);
        setIsLoading(false);
        props.onSuccess();
      } else {
        alert(response.data.errorMessage);
        setIsEditMode(false);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
          props.onError(
            `Unauthorized Access: ${
              data.errorMessage ||
              "You are not authorized to perform this action."
            }`
          );
        } else if (status === 500) {
          props.onError(
            `Server Issue: ${
              data.errorMessage ||
              "There was an issue with the server. Please try again later."
            }`
          );
        } else {
          props.onError(
            `Error: ${
              data.errorMessage || "An unknown error occurred."
            } (Code: ${status})`
          );
        }
      } else {
        props.onError(
          "Error submitting form. Please check your connection or try again."
        );
      }
      setIsLoading(false);
    }
  }

  return (
    <div
      className={
        isEditMode ? styles.editableCardContainer : styles.cardContainer
      }
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isEditMode ? (
            <div>
              <h2 className={styles.cardTitle}>Editing Card</h2>
              <label htmlFor="plan_name" className={styles.inputLabel}>
                Plan Name
              </label>
              <input
                type="text"
                id="plan_name"
                name="plan_name"
                value={editCard.plan_name}
                onChange={handleInputChange}
                className={styles.inputField}
                required
              />
            </div>
          ) : (
            <div className={styles.cardTitleContainer}>
              <h2 className={styles.cardTitle}>{props.planName}</h2>
              <span className={styles.rounded5G}>5G</span>
            </div>
          )}

          {!isEditMode && <hr className={styles.cardHr} />}
          {isEditMode ? (
            <div>
              <label htmlFor="plan_price" className={styles.inputLabel}>
                Plan price (€):
              </label>
              <input
                type="number"
                id="plan_price"
                name="plan_price"
                value={editCard.plan_price}
                onChange={handleInputChange}
                className={styles.inputField}
                required
              />
            </div>
          ) : (
            <h2 className={styles.cardPrice}>
              {props.price}€<span className={styles.monthText}>/month</span>
            </h2>
          )}

          <ul className={styles.cardList}>
            {isEditMode ? (
              <>
                <label
                  htmlFor="internet_data_limit_mb"
                  className={styles.inputLabel}
                >
                  Internet
                </label>
                <input
                  type="number"
                  id="internet_data_limit_mb"
                  name="internet_data_limit_mb"
                  value={editCard.internet_data_limit_mb}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
                <label
                  htmlFor="voice_minutes_limit"
                  className={styles.inputLabel}
                >
                  National Minutes
                </label>
                <input
                  type="number"
                  id="voice_minutes_limit"
                  name="voice_minutes_limit"
                  value={editCard.voice_minutes_limit}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
                <label htmlFor="sms_limit" className={styles.inputLabel}>
                  National SMS
                </label>
                <input
                  type="number"
                  id="sms_limit"
                  name="sms_limit"
                  value={editCard.sms_limit}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
                <label
                  htmlFor="internet_roaming_data_limit_mb"
                  className={styles.inputLabel}
                >
                  Roaming Internet
                </label>
                <input
                  type="number"
                  id="internet_roaming_data_limit_mb"
                  name="internet_roaming_data_limit_mb"
                  value={editCard.internet_roaming_data_limit_mb}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  required
                />
                <div className={styles.buttonContainer}>
                  <button
                    className={`${styles.cardBtn} ${styles.cardBtnCancel}`}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className={`${styles.cardBtn} ${styles.cardBtnSave}`}
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
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
                <div className={styles.buttonContainer}>
                  <button
                    className={`${styles.cardBtn} ${styles.cardBtnEdit}`}
                    onClick={handleToggleEdit}
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.cardBtn} ${styles.cardBtnDelete}`}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
