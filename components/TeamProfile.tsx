import React from "react";
import styles from "../styles/TeamProfile.module.css";

const TeamProfile = ({ name, score, className, bestPlayer }) => {
  return (
    <div className={className}>
      <div className={styles.teamContent}>
        <h2 className={styles.teamName}>{name}</h2>
        <p className={styles.teamScore}>Очки: {score}</p>
        <p
          className={styles.teamAlpha}
          onClick={() =>
            window.open(`https://solscan.io/account/${bestPlayer}?cluster=devnet`, "_blank")
          }
        >
          Alpha Predator: {bestPlayer?.slice(0, 4)}...{bestPlayer?.slice(-4)}
        </p>
      </div>
    </div>
  );
};

export default TeamProfile;
