"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import SaleItem from "./components/SaleItem";
import styles from "./page.module.css";
import axios from "axios";

export default function Sales() {
  const { data: session, status } = useSession();
  const [sales, setSales] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("Select");
  const [agents, setAgents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasFetchedSales, setHasFetchedSales] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedDateSort, setSelectedDateSort] = useState("Select");
  const [selectedCustomerSatisfaction, setSelectedCustomerSatisfaction] =
    useState("Select");
  const [selectedDeviceCode, setSelectedDeviceCode] = useState("Select");

  const [deviceCodes, setDeviceCodes] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [isOrderIdSearch, setIsOrderIdSearch] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("/api/agentCodes", {
          withCredentials: true,
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setAgents(data);
        } else {
          console.error("Invalid data format for agents:", data);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    const fetchDeviceCodes = async () => {
      try {
        const response = await axios.get("/api/deviceCodes", {
          withCredentials: true,
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setDeviceCodes(data);
        } else {
          console.error("Invalid data format for device codes:", data);
        }
      } catch (error) {
        console.error("Error fetching device codes:", error);
      }
    };

    fetchAgents();
    fetchDeviceCodes();
  }, []);

  const fetchSalesByOrderId = async () => {
    if (!orderId) {
      setErrorMessage("Please enter an Order ID.");
      return;
    }

    try {
      const response = await axios.get(`/api/sales?orderId=${orderId}`, {
        withCredentials: true,
      });
      setSales(response.data);
      setHasFetchedSales(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching sales by Order ID:", error);
      alert(`Error fetching sales data: ${error.message}`);
    }
  };

  const fetchSalesWithFilters = async () => {
    if (selectedAgentId === "Select") {
      setErrorMessage("Please select an agent.");
      return;
    }

    const url = `/api/sales?agentid=${selectedAgentId}&month=${selectedMonth}&year=${selectedYear}`;
    try {
      const response = await axios.get(url, { withCredentials: true });
      setSales(response.data);
      setHasFetchedSales(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching sales with filters:", error);
      alert(`Error fetching sales data: ${error.message}`);
    }
  };

  const applyFilters = async () => {
    if (
      selectedDateSort === "Select" &&
      selectedCustomerSatisfaction === "Select" &&
      selectedDeviceCode === "Select"
    ) {
      setErrorMessage("Please select at least one filter.");
      return;
    }

    setErrorMessage("");
    const filters = [
      selectedDateSort,
      selectedCustomerSatisfaction,
      selectedDeviceCode,
    ];

    const queryParams = new URLSearchParams();
    queryParams.append("agentid", selectedAgentId);
    queryParams.append("month", selectedMonth);
    queryParams.append("year", selectedYear);

    if (selectedDateSort !== "Select") {
      queryParams.append("dateSort", selectedDateSort);
    }
    if (selectedCustomerSatisfaction !== "Select") {
      queryParams.append("customerSatisfaction", selectedCustomerSatisfaction);
    }
    if (selectedDeviceCode !== "Select") {
      queryParams.append("deviceCode", selectedDeviceCode);
    }

    try {
      const response = await axios.get(`/api/sales?${queryParams.toString()}`, {
        withCredentials: true,
      });
      setSales(response.data);
      setHasFetchedSales(true);
    } catch (error) {
      console.error("Error applying filters:", error);
      alert(`Error fetching sales data: ${error.message}`);
    }
  };

  const handleAgentChange = (e) => {
    setSelectedAgentId(e.target.value);
    setSales([]);
    setHasFetchedSales(false);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSales([]);
    setHasFetchedSales(false);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSales([]);
    setHasFetchedSales(false);
  };

  const handleDateSortChange = (e) => {
    setSelectedDateSort(e.target.value);
    if (e.target.value !== "Select") {
      setSelectedCustomerSatisfaction("Select");
      setSelectedDeviceCode("Select");
    }
  };

  const handleCustomerSatisfactionChange = (e) => {
    setSelectedCustomerSatisfaction(e.target.value);
    if (e.target.value !== "Select") {
      setSelectedDateSort("Select");
      setSelectedDeviceCode("Select");
    }
  };

  const handleDeviceCodeChange = (e) => {
    setSelectedDeviceCode(e.target.value);
    if (e.target.value !== "Select") {
      setSelectedDateSort("Select");
      setSelectedCustomerSatisfaction("Select");
    }
  };

  const closeErrorMessage = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) =>
    (currentYear - i).toString()
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  return (
    <DashboardLayout>
      <h1>Sales</h1>
      <hr className={styles.separator} />

      <div className={styles.searchContainer}>
        <label className={styles.searchLabel}>Search By Order ID</label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={isOrderIdSearch}
            onChange={(e) => setIsOrderIdSearch(e.target.checked)}
          />
        </label>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className={styles.orderInput}
          disabled={!isOrderIdSearch}
        />
      </div>
      <div>
        <button
          onClick={fetchSalesByOrderId}
          className={styles.button}
          disabled={!isOrderIdSearch}
        >
          Fetch Sales by Order ID
        </button>
      </div>

      <hr className={styles.separator} />

      <div className={styles.options}>
        <div className={styles.filterSection}>
          <div>
            <label>Select Agent ID:</label>
            <select
              value={selectedAgentId}
              onChange={handleAgentChange}
              disabled={isOrderIdSearch}
              className={`${styles.selectInput} ${
                isOrderIdSearch ? styles.disabled : ""
              }`}
            >
              {/* Conditionally display options based on logged-in agent */}
              {[
                "Select",
                ...(session?.user?.agentid === "M001"
                  ? ["All Agents", ...agents]
                  : [session?.user?.agentid]),
              ].map((agentId, index) => (
                <option key={index} value={agentId}>
                  {agentId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Month:</label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={isOrderIdSearch}
              className={`${styles.selectInput} ${
                isOrderIdSearch ? styles.disabled : ""
              }`}
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {new Date(2020, month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Select Year:</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              disabled={isOrderIdSearch}
              className={`${styles.selectInput} ${
                isOrderIdSearch ? styles.disabled : ""
              }`}
            >
              {years.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={fetchSalesWithFilters}
              className={styles.button}
              disabled={isOrderIdSearch}
            >
              Fetch Sales with Filters
            </button>
          </div>
        </div>

        <div className={styles.filterSection}>
          <div>
            <label>Date Sort:</label>
            <select
              value={selectedDateSort}
              onChange={handleDateSortChange}
              disabled={isOrderIdSearch}
              className={`${styles.selectInput} ${
                isOrderIdSearch ? styles.disabled : ""
              }`}
            >
              {["Select", "ascending", "descending"].map((option, index) => (
                <option key={index} value={option}>
                  {option === "Select"
                    ? "Select"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Customer Satisfaction:</label>
            <select
              value={selectedCustomerSatisfaction}
              onChange={handleCustomerSatisfactionChange}
              disabled={isOrderIdSearch}
              className={`${styles.selectInput} ${
                isOrderIdSearch ? styles.disabled : ""
              }`}
            >
              {["Select", "Highest to Lowest", "Lowest to Highest"].map(
                (option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label>Device Code:</label>
            <select
              value={selectedDeviceCode}
              onChange={handleDeviceCodeChange}
              disabled={isOrderIdSearch}
              className={`${styles.selectInput} ${
                isOrderIdSearch ? styles.disabled : ""
              }`}
            >
              {["Select", ...deviceCodes].map((code, index) => (
                <option key={index} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={applyFilters}
              className={styles.button}
              disabled={isOrderIdSearch}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className={styles.errorMessage}>
          <span>{errorMessage}</span>
          <button className={styles.closeButton} onClick={closeErrorMessage}>
            x
          </button>
        </div>
      )}

      <div>
        {sales.length > 0 && (
          <div className={styles.salesList}>
            {sales.map((sale, index) => (
              <SaleItem key={index} sale={sale} />
            ))}
          </div>
        )}
        {hasFetchedSales && sales.length === 0 && (
          <div>No sales data available.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
