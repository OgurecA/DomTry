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



  return (
      <div>
        <MyOrdersReceiver />
        <ReceiverButtons />
      </div>
  );
};


export default MyOrdersReceiverPage;