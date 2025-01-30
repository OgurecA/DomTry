import { useRouter } from 'next/router';
import styles from '../../styles/RoleChoose.module.css'; // Создайте файл стилей по желанию
import { solCommands } from '../../utils/solCommands';
import * as web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const CourierButtons = () => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();

  

  const courierKey = new web3.PublicKey("DMxVZUCgETcZgg4hEqWwp4bxmUoSmxVLffV8HN9s3jgW")
  const receiverKey = new web3.PublicKey("ADiCp9b2BtHkt1PvipMjAmQfzThFMczwMzUtfYPNoY8b")
  const backupKey = new web3.PublicKey("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2")
  const senderKey = new web3.PublicKey("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2")
  const multisigAddressCourier = new web3.PublicKey("r6Gpd2NbzU4gNxKXnW9WD4yMGWoV1Q9RAvLTbVNR3FQ")
  const multisigAddressReceiver = new web3.PublicKey("r6Gpd2NbzU4gNxKXnW9WD4yMGWoV1Q9RAvLTbVNR3FQ")
  const amount = 100

  const createHolder = async () => {
    const transaction = await solCommands.CreateMultiSigTransaction(connection, publicKey, courierKey, receiverKey, backupKey, amount)

    const signature = await sendTransaction(transaction, connection);

    const confirmation = await connection.confirmTransaction(signature, 'finalized');
    console.log(signature)
    if (confirmation.value.err) {
      throw new Error('Transaction failed');
    }
  }

  const confirmDelivery = async () => {
    const transaction = await solCommands.confirmCashDelivery(connection, publicKey, multisigAddressCourier, multisigAddressReceiver, courierKey, receiverKey, senderKey, backupKey, amount)

    const { blockhash } = await connection.getLatestBlockhash("finalized");
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    const signedTransaction = await signTransaction(transaction);

  // Сериализуем для передачи следующему пользователю
  const serializedTransaction = signedTransaction.serialize({
    requireAllSignatures: false,
  }).toString('base64');

  console.log('Serialized Transaction:', serializedTransaction);

  }

  return (
    <div className={styles.panelContainer}>
      <button className={styles.button} onClick={() => createHolder()}>createHolder</button>
      <button className={styles.button} onClick={() => confirmDelivery()}>confirmDelivery</button>
    </div>
  );
};

export default CourierButtons;
