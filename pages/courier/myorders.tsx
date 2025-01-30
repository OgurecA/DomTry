import { useRouter } from 'next/router';
import styles from '../../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import MyOrdersCourier from '../../components/Courier/MyOrdersCourier';
import CourierButtons from '../../components/Courier/CourierButtons';

const MyOrdersCourierPage = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();



  return (
      <div>
        <MyOrdersCourier />
        <CourierButtons />
      </div>
  );
};


export default MyOrdersCourierPage;