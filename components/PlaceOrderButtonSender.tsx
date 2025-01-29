import { useRouter } from 'next/router';
import styles from '../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const PlaceOrderButtonSender = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const placeOrderSender = async (publicKey: string, amount: number) => {
    const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: publicKey, amount: amount })
    });

    const data = await response.json();
    console.log("Order created:", data);
};


  const TakeOrder = async () => {

  }

  return (
    <div className={styles.panelContainer}>
      <button className={styles.button} onClick={() => placeOrderSender(publicKey.toBase58(), 1)}>PlaceOrder</button>
      <button className={styles.button} onClick={() => TakeOrder()}>TakeOrder</button>
    </div>
  );
};

export default PlaceOrderButtonSender;
