import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import UserProfile from '../components/UserProfile';
import TeamProfile from '../components/TeamProfile';
import { OfficeAppBar } from '../components/OfficeAppBar';
import { Back } from '../components/Back';
import styles from '../styles/OfficePage.module.css';
import { ConnectButton } from '../components/ConnectButton';


const OfficePage = () => {
    const { connected } = useWallet();
    const router = useRouter();

    const [isUserInDatabase, setIsUserInDatabase] = useState<boolean | null>(null);
    const { publicKey } = useWallet();

    const user = {
        avatar: "/ZirMarket.jpg",
        name: "John Doe",
        info: [
          "Возраст: 29 лет",
          "Город: Нью-Йорк",
          "Email: john@example.com",
          "Баланс: 1000 SOL"
        ]
    };

    const team = {
        name: "Команда Гром",
        score: 1500
    };

    const checkUserInDatabase = async () => {
        if (!publicKey) return;
      
        try {
          const response = await fetch("/api/checkuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicKey: publicKey?.toBase58() }),
          });
      
          const result = await response.json();
          setIsUserInDatabase(result.exists);
        } catch (error) {
          console.error("❌ Ошибка при проверке пользователя в БД или нет пользователя:", error);
          setIsUserInDatabase(false); // В случае ошибки считаем, что пользователя нет
        }
      };

      useEffect(() => {
        if (publicKey) {
          checkUserInDatabase();
        }
      }, [publicKey]);
      
      

    return (
        <Back>
            <OfficeAppBar />
            <div className={styles.container}>
                <TeamProfile name={team.name} score={team.score} className={styles.teamContainer}/>
                <UserProfile avatar={user.avatar} name={user.name} info={user.info} className={styles.profileContainer} />
                <TeamProfile name={team.name} score={team.score} className={styles.teamContainer}/>
            </div>
            {isUserInDatabase === false && <ConnectButton />}
        </Back>
    );
};

export default OfficePage;
