import Head from "next/head"
import SenderButtons from "../components/Sender/SenderButtons";
import * as web3 from '@solana/web3.js';
import OrdersSender from "../components/Sender/OrdersSender";

const Sender = () => {

  const courierKey1 = new web3.PublicKey('DMxVZUCgETcZgg4hEqWwp4bxmUoSmxVLffV8HN9s3jgW');
  const receiverKey = new web3.PublicKey('ADiCp9b2BtHkt1PvipMjAmQfzThFMczwMzUtfYPNoY8b');
  const backupKey = new web3.PublicKey('ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2');

    return (
    <div>
      <Head>
      <title>Wallet-Adapter Example</title>
      <meta
        name="description"
        content="Wallet-Adapter Example"
      />
      </Head>
      <div>
        <h1>Sender Page</h1>
        <p>Content for the sender page.</p>
        <OrdersSender />
        <SenderButtons
          courierKey1={courierKey1}
          receiverKey={receiverKey}
          backupKey={backupKey}
        />
      </div>
    </div>
    );
  };
  
  export default Sender;
  