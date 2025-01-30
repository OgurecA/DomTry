import Head from "next/head"
import CourierButtons from "../components/Courier/CourierButtons";
import OrdersCourier from "../components/Courier/OrdersCourier";

const Courier = () => {
    return (
    <div>
      <Head>
      <title>Courier</title>
      <meta
        name="description"
        content="Wallet-Adapter Example"
      />
      </Head>
      <div>
        <h1>Courier Page</h1>
        <p>Content for the Courier page.</p>
        <CourierButtons />
        <OrdersCourier />
      </div>
    </div>
    );
  };
  
  export default Courier;
  