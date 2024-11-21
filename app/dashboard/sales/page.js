"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/app/dashboard/DashboardLayout";
import SaleItem from "./components/SaleItem";
import styles from "./page.module.css";
import axios from "axios";
import Loading from "@/app/components/functional/Loading";
import LoadingSales from "./components/LoadingSales";

export default function Sales() {
  const { data: session, status } = useSession();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [agents, setAgents] = useState([]);
  const [hasMoreSales, setHasMoreSales] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && selectedAgentId !== "") {
      if (selectedAgentId !== "") {
        fetchSales(page, selectedAgentId);
      } else {
        setSales([]);
      }
    }
  }, [status, page, selectedAgentId]);

  const fetchSales = async (pageNumber, agentId) => {
    try {
      setLoading(true);

      // Simulate a 1-second delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let url = `/api/sales?page=${pageNumber}&limit=10`;

      if (agentId && agentId !== "" && agentId !== "All Agents") {
        url += `&agentid=${agentId}`;
      }

      const response = await axios.get(url, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.length === 0) {
        setHasMoreSales(false);
        setLoading(false);
        return;
      }

      setSales((prevSales) => [...prevSales, ...data]);

      if (data.length < 10) {
        setHasMoreSales(false);
      }
    } catch (error) {
      console.error("Error details:", error);
      alert(`Error fetching sales data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;

    if (bottom && !loading && hasMoreSales && selectedAgentId !== "") {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMoreSales, selectedAgentId]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get("/api/users", {
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

    fetchAgents();
  }, []);

  const getAgentDropdownOptions = () => {
    if (session?.user.agentid === "M001") {
      return ["", "All Agents", ...agents];
    }
    return ["", session?.user.agentid];
  };

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <h1>Sales</h1>

      <div>
        <label>Select Agent ID:</label>
        <select
          value={selectedAgentId}
          onChange={(e) => {
            setSelectedAgentId(e.target.value);
            setSales([]); // Reset sales on agent change
            setHasMoreSales(true);
            setPage(1);
          }}
        >
          {getAgentDropdownOptions().map((agentId, index) => (
            <option key={index} value={agentId}>
              {agentId}
            </option>
          ))}
        </select>
      </div>

      {sales.length > 0 && (
        <div className={styles.salesList}>
          {sales.map((sale, index) => (
            <SaleItem key={index} sale={sale} /> // Render SaleItem for each sale
          ))}
        </div>
      )}

      {loading && <LoadingSales />}

      {!hasMoreSales && <div className={styles.endOfListLine}></div>}
    </DashboardLayout>
  );
}
