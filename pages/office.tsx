import { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import UserProfile from '../components/UserProfile';
import TeamProfile from '../components/TeamProfile';
import { OfficeAppBar } from '../components/OfficeAppBar';
import styles from '../styles/OfficePage.module.css';
import { ConnectButton } from '../components/ConnectButton';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { BackOffice } from '../components/BackOffice';
import { NavBarOffice } from '../components/NavBarOffice';

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

    const [bestPlayerTeam1, setBestPlayerTeam1] = useState<any | null>(null);
    const [bestPlayerTeam2, setBestPlayerTeam2] = useState<any | null>(null);

    const [isMobileLayout, setIsMobileLayout] = useState<boolean | null>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileLayout(window.innerWidth < 780);
        };

        // Вызываем сразу при загрузке
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


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

            const bestPlayersResponse = await fetch("/api/bestplayers");
            const bestPlayersData = await bestPlayersResponse.json();

            if (teamResponse.ok && teamData.teams && bestPlayersData && bestPlayersResponse.ok) {

                const userTeamId = userData.team
                const enemyTeamId = userData.team === 1 ? 2 : 1;

                const teamAData: TeamData | null = teamData.teams.find((team: TeamData) => team.id === userTeamId) || null;
                const teamBData: TeamData | null = teamData.teams.find((team: TeamData) => team.id === enemyTeamId) || null;

                setTeamA(teamAData);
                setTeamB(teamBData);

                setBestPlayerTeam1(bestPlayersData.bestPlayerTeam1);
                setBestPlayerTeam2(bestPlayersData.bestPlayerTeam2); 

                console.log(bestPlayerTeam2)
                console.log(bestPlayersData.bestPlayerTeam2)
                console.log(bestPlayersData.bestPlayerTeam2.publicKey)
                
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
        <BackOffice>
            <div className={styles.lightningContainer}>
                <div className={styles.lightningBolt}></div>
                <div className={styles.lightningBolt}></div>
                <div className={styles.lightningBolt}></div>
                <div className={styles.lightningBolt}></div>
                <div className={styles.lightningBolt}></div>
                <div className={styles.lightningBolt}></div>
            </div>
            <div className={styles.bankContainer}>
                BANK:
            </div>

            <OfficeAppBar />
            {isMobileLayout && (<NavBarOffice />)}
            <div className={styles.container}>
                {isMobileLayout ? (
                    <>
                        {/* UserProfile СНАЧАЛА при ширине < 1150px */}
                        {userData && (
                            <UserProfile
                                avatar={userData.avatar}
                                name={userData.name}
                                info={[
                                    `Balance: ${userData.balance} SOL`,
                                    `Input SOL: ${userData.input_sol}`,
                                    `Personal Points: ${userData.personal_points}`,
                                    `Team Points: ${userData.team_points}`
                                ]}
                                className={styles.profileContainer}
                            />
                        )}
                        <div className={styles.teamsContainer}>
                        {/* Команды под UserProfile */}
                        {teamA && bestPlayerTeam1 && bestPlayerTeam2 && (
                            <TeamProfile
                                name={teamA.name === "Team A" ? "Dire Warriors (Your Team)" : "Wild Hearts (Your Team)"}
                                score={teamA.score}
                                className={styles.teamContainer}
                                bestPlayer={teamA.name === "Team A" ? bestPlayerTeam1.publickey || 0 : bestPlayerTeam2.publickey || 0}
                            />
                        )}
    
                        {teamB && bestPlayerTeam1 && bestPlayerTeam2 && (
                            <TeamProfile
                                name={teamB.name === "Team A" ? "Dire Warriors" : "Wild Hearts"}
                                score={teamB.score}
                                className={styles.teamContainer}
                                bestPlayer={teamB.name === "Team A" ? bestPlayerTeam1.publickey || 0 : bestPlayerTeam2.publickey || 0}
                            />
                        )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Team - User - Team при ширине > 1150px */}
                        {teamA && bestPlayerTeam1 && bestPlayerTeam2 && (
                            <TeamProfile
                                name={teamA.name === "Team A" ? "Dire Warriors (Your Team)" : "Wild Hearts (Your Team)"}
                                score={teamA.score}
                                className={styles.teamContainer}
                                bestPlayer={teamA.name === "Team A" ? bestPlayerTeam1.publickey || 0 : bestPlayerTeam2.publickey || 0}
                            />
                        )}
    
                        {userData && (
                            <UserProfile
                                avatar={userData.avatar}
                                name={userData.name}
                                info={[
                                    `Balance: ${userData.balance} SOL`,
                                    `Input SOL: ${userData.input_sol}`,
                                    `Personal Points: ${userData.personal_points}`,
                                    `Team Points: ${userData.team_points}`
                                ]}
                                className={styles.profileContainer}
                            />
                        )}
    
                        {teamB && bestPlayerTeam1 && bestPlayerTeam2 && (
                            <TeamProfile
                                name={teamB.name === "Team A" ? "Dire Warriors" : "Wild Hearts"}
                                score={teamB.score}
                                className={styles.teamContainer}
                                bestPlayer={teamB.name === "Team A" ? bestPlayerTeam1.publickey || 0 : bestPlayerTeam2.publickey || 0}
                            />
                        )}
                    </>
                )}
            </div>
    
            {/* Кнопка JOIN, если пользователя нет в БД */}
            {isUserInDatabase === false && <ConnectButton setCheck={setCheck} />}
        </BackOffice>
    );
    
};

export default OfficePage;
