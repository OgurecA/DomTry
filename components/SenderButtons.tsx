import { useRouter } from 'next/router';
import styles from '../styles/RoleChoose.module.css'; // Создайте файл стилей по желанию
import { solCommands } from '../utils/solCommands';
import * as web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


interface SenderButtonsProps {
  courierKey1: web3.PublicKey;
  receiverKey: web3.PublicKey;
  backupKey: web3.PublicKey;
}

const SenderButtons: React.FC<SenderButtonsProps> = ({ courierKey1, receiverKey, backupKey }) => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  

  const createHolder = async () => {

  }

  const placeOrder = async () => {

  }

  return (
    <div className={styles.panelContainer}>
      <button className={styles.button} onClick={() => createHolder()}>createHolder</button>
    </div>
  );
};

export default SenderButtons;
