import { useRouter } from 'next/router';
import styles from '../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

const OrdersCourier = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [orders, setOrders] = useState<any[]>([]); // Храним заказы
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Загружаем заказы при загрузке компонента
  useEffect(() => {
    fetchWaitingOrders();
  }, []);

  const fetchWaitingOrders = async () => {
    const response = await fetch("/api/orders?status=waiting");
    const data = await response.json();
    const filteredOrders = data.filter(order => order.sender && order.receiver); // Оставляем заказы, где есть sender и receiver
    setOrders(filteredOrders);
};



  const TakeOrderCourier = async (orderId: number) => {
    if (!publicKey) return alert("Connect wallet first!");
    if (!selectedOrderId) return alert("Choose order first!");
    const response = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, role: "courier", user: publicKey.toBase58() })
    });

    const data = await response.json();
    console.log("Order updated:", data);
    fetchWaitingOrders()
  };

  return (
    <div className={styles.container}>
      <div className={styles.panelContainer}>
        <button className={styles.button} onClick={() => TakeOrderCourier(selectedOrderId)}>
          Take Order
        </button>
      </div>

      <div className={styles.sidebar}>
        <h3>Waiting Orders</h3>
        <div className={styles.orderList}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className={`${styles.orderItem} ${selectedOrderId === order.id ? styles.selectedOrder : ''}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <p>ID: {order.id}</p>
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


export default OrdersCourier;
