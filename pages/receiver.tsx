import Head from "next/head"
import ReceiverButtons from "../components/Receiver/ReceiverButtons";
import OrdersReceiver from "../components/Receiver/OrdersReceiver";

const Reciever = () => {
    return (
    <div>
      <Head>
      <title>Reciever</title>
      <meta
        name="description"
        content="Wallet-Adapter Example"
      />
      </Head>
      <div>
        <h1>Reciever Page</h1>
        <p>Content for the Reciever page.</p>
        <ReceiverButtons />
        <OrdersReceiver />
      </div>
    </div>
    );
  };
  
  export default Reciever;
  