import React from "react";
import styles from "../styles/TeamProfile.module.css";

const TeamProfile = ({ name, members, score }) => {
  return (
    <div className={styles.teamContainer}>
      <h2 className={styles.teamName}>{name}</h2>
      <p className={styles.teamScore}>Очки: {score}</p>
      <div className={styles.teamInfo}>
        {members.map((member, index) => (
          <p key={index}>{member}</p>
        ))}
      </div>
    </div>
  );
};

export default TeamProfile;
