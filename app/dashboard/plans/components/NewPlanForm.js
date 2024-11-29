import React, { useState } from "react";
import axios from "axios";
import styles from "./NewPlanForm.module.css";
import Loading from "./Loading";

export default function NewPlanForm(props) {
  const [formData, setFormData] = useState({
    plan_name: "",
    plan_price: "",
    internet_data_limit_mb: "",
    voice_minutes_limit: "",
    sms_limit: "",
    internet_roaming_data_limit_mb: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.plan_name ||
      !formData.plan_price ||
      !formData.internet_data_limit_mb ||
      !formData.voice_minutes_limit ||
      !formData.sms_limit ||
      !formData.internet_roaming_data_limit_mb
    ) {
      setError("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post("/api/pricePlans", formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          plan_name: "",
          plan_price: "",
          internet_data_limit_mb: "",
          voice_minutes_limit: "",
          sms_limit: "",
          internet_roaming_data_limit_mb: "",
        });
        props.onSuccess();
      } else {
        setError(response.data.error || "Failed to create plan.");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        // Pass the error message to the parent
        if (status === 401) {
          props.onError(
            `Unauthorized Access: ${
              data.error || "You are not authorized to perform this action."
            }`
          );
        } else if (status === 500) {
          props.onError(
            `Server Issue: ${
              data.error ||
              "There was an issue with the server. Please try again later."
            }`
          );
        } else {
          props.onError(
            `Error: ${
              data.error || "An unknown error occurred."
            } (Code: ${status})`
          );
        }
      } else {
        props.onError(
          "Error submitting form. Please check your connection or try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      {isSubmitting && <Loading />}
      <h2 className={styles.formTitle}>Create New Plan</h2>

      {success && (
        <div className={styles.successMessage}>Plan created successfully!</div>
      )}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="plan_name" className={styles.inputLabel}>
            Plan Name:
          </label>
          <input
            type="text"
            id="plan_name"
            name="plan_name"
            value={formData.plan_name}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="plan_price" className={styles.inputLabel}>
            Plan Price (€):
          </label>
          <input
            type="number"
            id="plan_price"
            name="plan_price"
            value={formData.plan_price}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="internet_data_limit_mb" className={styles.inputLabel}>
            Internet Data Limit (MB):
          </label>
          <input
            type="number"
            id="internet_data_limit_mb"
            name="internet_data_limit_mb"
            value={formData.internet_data_limit_mb}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="voice_minutes_limit" className={styles.inputLabel}>
            Voice Minutes Limit:
          </label>
          <input
            type="number"
            id="voice_minutes_limit"
            name="voice_minutes_limit"
            value={formData.voice_minutes_limit}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sms_limit" className={styles.inputLabel}>
            SMS Limit:
          </label>
          <input
            type="number"
            id="sms_limit"
            name="sms_limit"
            value={formData.sms_limit}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label
            htmlFor="internet_roaming_data_limit_mb"
            className={styles.inputLabel}
          >
            Roaming Internet Limit (MB):
          </label>
          <input
            type="number"
            id="internet_roaming_data_limit_mb"
            name="internet_roaming_data_limit_mb"
            value={formData.internet_roaming_data_limit_mb}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
