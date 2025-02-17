import React from "react";
import styles from "../styles/TeamProfile.module.css";

const TeamProfile = ({ name, score, className, bestPlayer }) => {
  return (
    <div className={className}>
      <h2 className={styles.teamName}>{name}</h2>
      <p className={styles.teamScore}>Очки: {score}</p>
      <p className={styles.teamScore}>Alpha Predator: {bestPlayer}</p>
    </div>
  );
};

export default TeamProfile;
