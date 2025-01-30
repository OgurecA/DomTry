import { useRouter } from 'next/router';
import styles from '../../styles/RoleChoose.module.css'; // Создайте файл стилей по желанию
import { solCommands } from '../../utils/solCommands';
import * as web3 from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


interface ReceiverButtonsProps {
  selectedOrder: {
    id: number;
    sender?: string;
    receiver?: string;
    courier?: string;
    amount: number;
    multisig_address_receiver?: string;
    multisig_address_courier?: string;
    serialized?: string;
  } | null;
}


const ReceiverButtons: React.FC<ReceiverButtonsProps> = ({ selectedOrder }) => {
  const router = useRouter();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  
  const backupKey = new web3.PublicKey("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2")
  

  const createHolder = async () => {
    const courierKey1 = new web3.PublicKey(selectedOrder.courier)
    const receiverKey = new web3.PublicKey(selectedOrder.receiver)
    const amount = selectedOrder.amount
    const { transaction, multisigAddress } = await solCommands.CreateMultiSigTransaction(connection, publicKey, courierKey1, receiverKey, backupKey, amount)

    const signature = await sendTransaction(transaction, connection);

    const confirmation = await connection.confirmTransaction(signature, 'finalized');
    console.log(signature)
    if (confirmation.value.err) {
      throw new Error('Transaction failed');
    }
    addMultisigAddress(multisigAddress.toBase58())
  }

  const confirmDelivery = async () => {
    const serializedTransaction = selectedOrder.serialized
    
    const transaction = web3.Transaction.from(Buffer.from(serializedTransaction, 'base64'));


    const signature = await sendTransaction(transaction, connection);

    const confirmation = await connection.confirmTransaction(signature, 'finalized');

    console.log(signature)

  }

  const addMultisigAddress = async (multisigAddress: string) => {
    if (!selectedOrder) return alert("Select an order first!");
    if (!publicKey) return alert("Connect your wallet!");
  
    const response = await fetch("/api/orders/multisig", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: selectedOrder.id,
        role: "multisigAddressCourier", // или "courier" в зависимости от кнопки
        user: multisigAddress
      }),
    });
  
    const data = await response.json();
    if (data.success) {
      alert("Multisig address added successfully!");
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div className={styles.panelContainer}>
      <button className={styles.button} onClick={() => createHolder()}>createHolder</button>
      <button className={styles.button} onClick={() => confirmDelivery()}>confirmDelivery</button>
    </div>
  );
};

export default ReceiverButtons;
