import React from "react";
import styles from "../styles/TeamProfile.module.css";

const TeamProfile = ({ name, score }) => {
  return (
    <div className={styles.teamContainer}>
      <h2 className={styles.teamName}>{name}</h2>
      <p className={styles.teamScore}>Очки: {score}</p>
    </div>
  );
};

export default TeamProfile;
