import { useRouter } from 'next/router';
import styles from '../../styles/OrderButton.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import MyOrdersSender from '../../components/Sender/MyOrdersSender';
import SenderButtons from '../../components/Sender/SenderButtons';
import * as web3 from '@solana/web3.js';

const MyOrdersSenderPage = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const courierKey1 = new web3.PublicKey('DMxVZUCgETcZgg4hEqWwp4bxmUoSmxVLffV8HN9s3jgW');
  const receiverKey = new web3.PublicKey('ADiCp9b2BtHkt1PvipMjAmQfzThFMczwMzUtfYPNoY8b');
  const backupKey = new web3.PublicKey('ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2');

  return (
      <div>
        <MyOrdersSender />
        <SenderButtons
          courierKey1={courierKey1}
          receiverKey={receiverKey}
          backupKey={backupKey}
        />
      </div>
  );
};


export default MyOrdersSenderPage;