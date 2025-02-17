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
    team: number;
  } | null;

  type TeamData = {
    id: number;
    name: string;
    score: number;
    players: number;
    bank: number;
  };
  
const OfficePage = () => {
    const router = useRouter();
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const [isUserInDatabase, setIsUserInDatabase] = useState<boolean | null>(null);
    const [check, setCheck] = useState<boolean>(false);
    

    const [userData, setUserData] = useState<PlayerData | null>(null);
   

    const [teamA, setTeamA] = useState<TeamData | null>(null);
    const [teamB, setTeamB] = useState<TeamData | null>(null);

    const [userTeam, setUserTeam] = useState<number | null>(null);
    const [enemyTeam, setEnemyTeam] = useState<number | null>(null);


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
                    team: result.team || 0,
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
      }, [publicKey, check]);
      
      useEffect(() => {
        if (!publicKey) return;
    
        const fetchUserData = async () => {
          try {

            const userResponse = await fetch("/api/getuser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicKey: publicKey.toBase58() }),
              });
      
            const userData = await userResponse.json();
            if (!userResponse.ok || !userData.team) {
                console.warn("⚠ Пользователь не найден или не состоит в команде.");
                return;
            }
      
            console.log(`✅ Пользователь ${publicKey.toBase58()} в команде ID: ${userData.team}`);
            

            const teamResponse = await fetch("/api/teaminfo");            
            const teamData = await teamResponse.json();

            if (teamResponse.ok && teamData.teams) {

                const userTeamId = userData.team
                const enemyTeamId = userData.team === 1 ? 2 : 1;

                const teamAData: TeamData | null = teamData.teams.find((team: TeamData) => team.id === userTeamId) || null;
                const teamBData: TeamData | null = teamData.teams.find((team: TeamData) => team.id === enemyTeamId) || null;

                setTeamA(teamAData);
                setTeamB(teamBData);
                
            } else {
                console.warn("⚠ Данные о командах не найдены.");
            }
          } catch (error) {
            console.error("❌ Ошибка при запросе данных о командах:", error);
          }
        };
    
        fetchUserData();
      }, [publicKey]);

    return (
        <Back>
            <OfficeAppBar />
            <div className={styles.container}>
                {teamA && (
                    <TeamProfile
                        name={teamA.name === "Team A" ? "Dire Warriors" : "Wild Hearts"}
                        score={teamA.score}
                        className={styles.teamContainer}
                    />
                )}
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
                {teamB && (
                    <TeamProfile
                        name={teamB.name === "Team A" ? "Dire Warriors" : "Wild Hearts"}
                        score={teamB.score}
                        className={styles.teamContainer}
                    />
                )}
            </div>
            {isUserInDatabase === false && <ConnectButton setCheck={setCheck} />}
        </Back>
    );
};

export default OfficePage;
