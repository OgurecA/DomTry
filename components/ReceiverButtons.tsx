import { useRouter } from 'next/router';
import styles from '../styles/RoleChoose.module.css'; // Создайте файл стилей по желанию
import { solCommands } from '../utils/solCommands';
import * as web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const ReceiverButtons = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  

  const courierKey1 = new web3.PublicKey("DMxVZUCgETcZgg4hEqWwp4bxmUoSmxVLffV8HN9s3jgW")
  const receiverKey = new web3.PublicKey("ADiCp9b2BtHkt1PvipMjAmQfzThFMczwMzUtfYPNoY8b")
  const backupKey = new web3.PublicKey("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2")
  const amount = 100

  const createHolder = async () => {
    const transaction = await solCommands.CreateMultiSigTransaction(connection, publicKey, courierKey1, receiverKey, backupKey, amount)

    const signature = await sendTransaction(transaction, connection);

    const confirmation = await connection.confirmTransaction(signature, 'finalized');
    console.log(signature)
    if (confirmation.value.err) {
      throw new Error('Transaction failed');
    }
  }

  const confirmDelivery = async () => {
    const serializedTransaction = "AqLLVxYAtcNEyrWK2FQzigp+kP6IoWGjIdc9sRarF6xymLBnwc6Byyk46cVDQd6kFkGMqD/FA3c+oaOOy3q5JAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgECBreqmtH3gwjIErdwQVo0+9sSc9sFs7SLM7ChTk51e+GLiPq9vkzJ6KjGHGtkSWv1RVMVhEkotJnpNcCmdPwZoBSYIYn62xR0lRzxy8rvOljvOYvsoz26wmvyaXqqOUjR+PCIeYL3NH2t6dC/BBGQb81/OXTaFMO+XNOYIEbnzVYoDJNr7XqhsYJbdo0Abj99hBpjs2vCCi4Wyz43pJcpn5sG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqY5Psg/EjfG5la/qmEE/7O/uruhLts3O7fyfSExIv8yUAQUFAwIEAAEJA2QAAAAAAAAA+9sSc9sFs7SLM7ChTk51e+GLiPq9vkzJ6KjGHGtkSWv1RVMVhEkotJnpNcCmdPwZoBSYIYn62xR0lRzxy8rvOljvOYvsoz26wmvyaXqqOUjR+PCIeYL3NH2t6dC/BBGQb81/OXTaFMO+XNOYIEbnzVYoDJNr7XqhsYJbdo0Abj99hBpjs2vCCi4Wyz43pJcpn5sG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqTp9BX2XbwwfZmJkZBFrTDK6k8Zbl/7Iv2ibV856xeZ0AQUFAwIEAAEJA2QAAAAAAAAA"

    const transaction = web3.Transaction.from(Buffer.from(serializedTransaction, 'base64'));


    const signature = await sendTransaction(transaction, connection);

    const confirmation = await connection.confirmTransaction(signature, 'finalized');

    console.log(signature)

  }

  return (
    <div className={styles.panelContainer}>
      <button className={styles.button} onClick={() => createHolder()}>createHolder</button>
      <button className={styles.button} onClick={() => confirmDelivery()}>confirmDelivery</button>
    </div>
  );
};

export default ReceiverButtons;
