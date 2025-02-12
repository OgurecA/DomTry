import React, { FC, useState } from "react";
import styles from "../styles/ConnectButton.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

export const ConnectButton: FC = () => {

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [value, setValue] = useState(0.01);
  const gradient = `linear-gradient(90deg, #ff9900 ${value * 100}%, #444 ${value * 100}%)`;
  
  const joinGame = async () => {

    

  }


  return (
    <div className={styles.container}>
      {/* Ползунок (Slider) */}
      <input
        type="range"
        min="0.01"
        max="1"
        step="0.01"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className={styles.slider}
        style={{ background: gradient }}
      />
      <span className={styles.valueLabel}>{value.toFixed(2)} SOL</span>

      {/* Кнопка JOIN */}
      <button className={styles.ConnectButton}>
        JOIN
      </button>
    </div>
  );

};

