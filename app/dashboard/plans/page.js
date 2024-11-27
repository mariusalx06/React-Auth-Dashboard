"use client";
import { useRef, useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import styles from "./page.module.css";
import CardItem from "../components/CardItem";

export default function Plans() {
  const carouselRef = useRef(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isTouchDevice = useRef(false);
  const touchThreshold = 5;

  const [isFirstParagraphVisible, setIsFirstParagraphVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFirstParagraphVisible((prevState) => !prevState);
    }, 3000); // Toggle every 3 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e) => {
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

  return (
    <DashboardLayout>
      <div className={styles.plansPage}>
        <h1>Price Plans</h1>
        <hr className={styles.separator} />

        <div className={styles.main}>
          <h2>Currently Active Price Plans</h2>
          <div className={styles.textWrapper}>
            <p
              className={`${styles.switchingText} ${
                isFirstParagraphVisible ? styles.showFirst : styles.hideFirst
              }`}
            >
              View the Price Plans
            </p>
            <p
              className={`${styles.switchingText} ${
                !isFirstParagraphVisible ? styles.showSecond : styles.hideSecond
              }`}
            >
              You can also Edit/Add/Remove
            </p>
          </div>
        </div>
        <div className={styles.carouselWrapper}>
          <div
            className={styles.carouselContainer}
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            <CardItem
              title="Fun"
              price="10$"
              internetLimit="1024"
              voiceLimit="Unlimited"
              smsLimit="Unlimited"
              type="plan"
            />
            <CardItem
              title="Smart"
              price="10$"
              internetLimit="1024"
              voiceLimit="Unlimited"
              smsLimit="Unlimited"
              type="plan"
            />
            <CardItem
              title="Smart Plus"
              price="10$"
              internetLimit="1024"
              voiceLimit="Unlimited"
              smsLimit="Unlimited"
              type="plan"
            />

            <CardItem
              title="Travel"
              price="10$"
              internetLimit="1024"
              voiceLimit="Unlimited"
              smsLimit="Unlimited"
              type="plan"
            />
          </div>
        </div>
        <div className={styles.main}></div>
      </div>
    </DashboardLayout>
  );
}
