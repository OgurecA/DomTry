import Head from "next/head"
import SenderButtons from "../../components/Sender/SenderButtons";

import OrdersSender from "../../components/Sender/OrdersSender";

const Sender = () => {

  
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
      </div>
    </div>
    );
  };
  
  export default Sender;
  