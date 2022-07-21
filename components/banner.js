import React from "react";
import styles from "./banner.module.css";

const Banner = ({ buttonText, handleOnClick }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Restaurant</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local restaurant!</p>
      <button onClick={handleOnClick} className={styles.button}>
        {buttonText}
      </button>
    </div>
  );
};

export default Banner;
