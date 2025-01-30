import { useRouter } from 'next/router';
import styles from '../../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';


interface Order {
  id: number;
  sender?: string;
  receiver?: string;
  courier?: string;
  amount: number;
  multisig_address_receiver?: string;
  multisig_address_courier?: string;
  serialized?: string;
}

interface MyOrdersCourierProps {
  onSelectOrder: (order: Order | null) => void; // Функция для передачи данных наверх
}


const MyOrdersCourier: React.FC<MyOrdersCourierProps> = ({ onSelectOrder }) => {
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
  
    const filteredOrders = data.filter(order => order.courier === publicKey.toBase58());
  
    setOrders(filteredOrders);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrderId(order.id);
    onSelectOrder(order); // Передаём выбранный заказ в родительский компонент
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
                onClick={() => handleOrderClick(order)}
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


export default MyOrdersCourier;