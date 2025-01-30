import { useRouter } from 'next/router';
import styles from '../../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

const MyOrdersReceiver = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [orders, setOrders] = useState<any[]>([]); // Храним заказы
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Загружаем заказы при загрузке компонента
  useEffect(() => {
    fetchActiveOrders();
  }, []);


  const fetchActiveOrders = async () => {
    if (!publicKey) return; // Проверяем, подключен ли кошелек
    
    const response = await fetch("/api/orders?status=active");
    const data = await response.json();
  
    const filteredOrders = data.filter(order => order.receiver === publicKey.toBase58());
  
    setOrders(filteredOrders);
  };
  


  const TakeOrderSender = async (orderId: number) => {
    
  };

  return (
      <div className={styles.sidebar}>
        <h3>My Orders</h3>
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
            <p>No active orders</p>
          )}
        </div>
      </div>
  );
};


export default MyOrdersReceiver;