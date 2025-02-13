import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import UserProfile from '../components/UserProfile';
import TeamProfile from '../components/TeamProfile';
import { OfficeAppBar } from '../components/OfficeAppBar';
import { Back } from '../components/Back';
import styles from '../styles/OfficePage.module.css';
import { ConnectButton } from '../components/ConnectButton';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

type PlayerData = {
    avatar: string;
    name: string;
    balance: number;
    input_sol: number;
    personal_points: number;
    team_points: number;
  } | null;

  
const OfficePage = () => {
    const { connection } = useConnection();
    const router = useRouter();

    const [isUserInDatabase, setIsUserInDatabase] = useState<boolean | null>(null);
    const { publicKey } = useWallet();

    const [userData, setUserData] = useState<PlayerData | null>(null);
   

    const team = {
        name: "Команда Гром",
        members: ["Игрок 1", "Игрок 2", "Игрок 3"],
        score: 1500
    };


    useEffect(() => {
        if (!publicKey) return;
    
        const fetchUserData = async () => {
          try {
            const solBalance = await connection.getBalance(publicKey);
            const convertedBalance = solBalance / LAMPORTS_PER_SOL;
            const response = await fetch("/api/getuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicKey: publicKey.toBase58() }),
            });              
    
            const result = await response.json();
            if (response.ok && result.animalKey) {
                setUserData({
                    avatar: result.animalImage || "/Avatar.png",
                    name: `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`,
                    balance: convertedBalance,
                    personal_points: result.personalPoints || 0,
                    team_points: result.teamPoints || 0,
                    input_sol: result.inputSol || 0
                });
                setIsUserInDatabase(true);
            } else {
                console.log("⚠ Пользователь не найден в БД:", publicKey.toBase58());
                setIsUserInDatabase(false);
            }
          } catch (error) {
            console.error("❌ Ошибка при запросе данных пользователя:", error);
            setIsUserInDatabase(false);
          }
        };
    
        fetchUserData();
      }, [publicKey]);
      
      

    return (
        <Back>
            <OfficeAppBar />
            <div className={styles.container}>
                <TeamProfile name={team.name} score={team.score} className={styles.teamContainer}/>
                {userData && <UserProfile
                    avatar={userData.avatar}
                    name={userData.name}
                    info={[
                        `Balance: ${userData.balance} SOL`,
                        `Input SOL: ${userData.input_sol} SOL`,
                        `Personal Points: ${userData.personal_points}`,
                        `Team Points: ${userData.team_points}`
                    ]}
                    className={styles.profileContainer}
                />}
                <TeamProfile name={team.name} score={team.score} className={styles.teamContainer}/>
            </div>
            {isUserInDatabase === false && <ConnectButton />}
        </Back>
    );
};

export default OfficePage;
