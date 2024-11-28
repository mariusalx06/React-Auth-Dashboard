"use client";
import { useRef, useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import styles from "./page.module.css";
import CardItem from "../components/CardItem";
import NewPlanForm from "../components/NewPlanForm";
import Loading from "@/app/components/functional/Loading";
import SwipeIcon from "@mui/icons-material/Swipe";

export default function Plans() {
  const carouselRef = useRef(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isTouchDevice = useRef(false);
  const touchThreshold = 5;

  const [isFirstParagraphVisible, setIsFirstParagraphVisible] = useState(true);
  const [isCentered, setIsCentered] = useState(false);

  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSwipeIcon, setShowSwipeIcon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFirstParagraphVisible((prevState) => !prevState);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.scrollWidth;
        const wrapperWidth = window.innerWidth;
        setIsCentered(containerWidth < wrapperWidth);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/pricePlans");

      if (!response.ok) {
        throw new Error("Failed to fetch plans data");
      }

      const data = await response.json();
      setPlans(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleMouseDown = (e) => {
    handleCarouselClick();
    isMouseDown.current = true;
    startX.current = e.clientX;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };

  const handleMouseLeave = () => {
    isMouseDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown.current) return;

    requestAnimationFrame(() => {
      const distance = e.clientX - startX.current;
      carouselRef.current.scrollLeft = scrollLeft.current - distance;
    });
  };

  const handleTouchStart = (e) => {
    handleCarouselClick();
    isTouchDevice.current = true;
    startX.current = e.touches[0].clientX;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleTouchEnd = () => {
    isTouchDevice.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isTouchDevice.current) return;

    const distance = e.touches[0].clientX - startX.current;

    if (Math.abs(distance) > touchThreshold) {
      requestAnimationFrame(() => {
        carouselRef.current.scrollLeft = scrollLeft.current - distance;
      });
    }
  };

  const handleCarouselClick = () => {
    setShowSwipeIcon(false);
  };

  return (
    <DashboardLayout>
      <div className={styles.plansPage}>
        <h1>Price Plans</h1>
        <hr className={styles.separator} />

        <div className={styles.main}>
          <h2>
            Currently <strong>Active</strong> Plans
          </h2>
          <div className={styles.textWrapper}>
            <div
              className={`${styles.switchingTextWrapper} ${
                isFirstParagraphVisible ? styles.showFirst : styles.hideFirst
              }`}
            >
              <p>
                <span>View the Price Plans</span>
                <span>You can also Edit/Add/Remove</span>
              </p>
            </div>
            <div
              className={`${styles.switchingTextWrapper} ${
                !isFirstParagraphVisible ? styles.showSecond : styles.hideSecond
              }`}
            >
              <p>
                <span>Be careful with the discounts</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.carouselWrapper}>
          {error && <div>Error:{error}</div>}
          {showSwipeIcon && (
            <SwipeIcon
              className={styles.swipeIcon}
              onClick={handleCarouselClick}
            />
          )}
          <div
            className={`${styles.carouselContainer} ${
              isCentered ? styles.centered : ""
            }`}
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onClick={handleCarouselClick}
          >
            {plans.map((plan) => (
              <CardItem
                key={plan.id}
                title={plan.plan_name}
                price={`${plan.plan_price}€`}
                internetLimit={`${plan.internet_data_limit_mb} MB`}
                voiceLimit={
                  plan.voice_minutes_limit === "Unlimited"
                    ? "Unlimited"
                    : `${plan.voice_minutes_limit} `
                }
                smsLimit={
                  plan.sms_limit === "Unlimited"
                    ? "Unlimited"
                    : `${plan.sms_limit} SMS`
                }
                internetRoamingLimit={`${plan.internet_roaming_data_limit_mb} MB`}
                type="plan"
              />
            ))}
          </div>
        </div>
        <div className={styles.main}>
          <NewPlanForm onSuccess={fetchPlans} />
        </div>
      </div>
    </DashboardLayout>
  );
}
