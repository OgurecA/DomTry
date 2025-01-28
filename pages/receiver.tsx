import Head from "next/head"
import ReceiverButtons from "../components/ReceiverButtons";

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
      </div>
    </div>
    );
  };
  
  export default Reciever;
  