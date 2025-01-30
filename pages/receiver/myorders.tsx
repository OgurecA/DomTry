import { useRouter } from 'next/router';
import styles from '../../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import MyOrdersReceiver from '../../components/Receiver/MyOrdersReceiver';
import ReceiverButtons from '../../components/Receiver/ReceiverButtons';

const MyOrdersReceiverPage = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [selectedOrder, setSelectedOrder] = useState(null);



  return (
      <div>
        <MyOrdersReceiver onSelectOrder={setSelectedOrder} />
        <ReceiverButtons selectedOrder={selectedOrder} />
      </div>
  );
};


export default MyOrdersReceiverPage;