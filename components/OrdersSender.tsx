import { useRouter } from 'next/router';
import styles from '../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

const OrdersSender = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [orders, setOrders] = useState<any[]>([]); // Храним заказы

  // Загружаем заказы при загрузке компонента
  useEffect(() => {
    fetchWaitingOrders();
  }, []);

  const fetchWaitingOrders = async () => {
    const response = await fetch("/api/orders?status=waiting");
    const data = await response.json();
    setOrders(data);
  };

  const placeOrderSender = async (publicKey: string, amount: number) => {
    const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: publicKey, amount: amount })
    });

    const data = await response.json();
    console.log("Order created:", data);
    fetchWaitingOrders();
};


  const TakeOrder = async () => {

  }

  return (
    <div className={styles.container}>
      {/* Основные кнопки */}
      <div className={styles.panelContainer}>
        <button className={styles.button} onClick={() => placeOrderSender(publicKey.toBase58(), 1)}>
          Place Order
        </button>
      </div>

      {/* Боковая панель с заказами */}
      <div className={styles.sidebar}>
        <h3>Waiting Orders</h3>
        <div className={styles.orderList}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className={styles.orderItem}>
                <p>ID: {order.id}</p>
                <p>Sender: {order.sender || "Waiting..."}</p>
                <p>Amount: {order.amount}</p>
              </div>
            ))
          ) : (
            <p>No waiting orders</p>
          )}
        </div>
      </div>
    </div>
  );
};


export default OrdersSender;
