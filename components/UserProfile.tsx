import React from "react";
import styles from '../styles/UserProfile.module.css'; // Подключаем CSS-модуль

const UserProfile = ({ avatar, name, info, className }) => {
  return (
    <div className={className}>
      <div className={styles.profile}>
        <img src={avatar} alt="User Avatar" className={styles.avatar} />
        <h2 className={styles.username}>{name}</h2>
        <div className={styles.userInfo}>
          {info.map((item, index) => (
            <p key={index} className={styles.infoItem}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
