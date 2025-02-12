import { useEffect } from 'react';
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
        members: ["Игрок 1", "Игрок 2", "Игрок 3"],
        score: 1500
    };

    return (
        <Back>
            <OfficeAppBar />
            <div className={styles.container}>
                <UserProfile avatar={user.avatar} name={user.name} info={user.info} />
                <TeamProfile name={team.name} members={team.members} score={team.score} />
            </div>
            <ConnectButton />
        </Back>
    );
};

export default OfficePage;
