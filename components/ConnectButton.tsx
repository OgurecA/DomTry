import React, { FC, useState } from "react";
import styles from "../styles/ConnectButton.module.css";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { solCommands } from '../utils/solCommands';
import { tools } from "../utils/tools";


type TeamData = {
  id: number;
  name: string;
  bank: number;
  players: number;
} | null;


type ConnectButtonProps = {
  setCheck: (value: boolean) => void; // ✅ Принимаем setCheck как пропс
};

export const ConnectButton: FC<ConnectButtonProps> = ({ setCheck }) => {

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [ status, setStatus ] = useState<string>("JOIN");

  const [value, setValue] = useState(0.01);

  
  const joinGame = async () => {
    try {
      setStatus("JOINING...")
      const { transaction, amount } = await solCommands.JoinGame(connection, publicKey, value);
  
      const signature = await sendTransaction(transaction, connection);
  
      const confirmation = await connection.confirmTransaction(signature, 'finalized');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }
  
      console.log("✅ Транзакция успешно подтверждена:", signature);

      const verifyResponse = await fetch("/api/verifyTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            transactionId: signature,
            publicKey: publicKey.toBase58(),
            amount: amount
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(`❌ Ошибка: ${verifyResult.message}`);
      }

      console.log("✅ Транзакция успешно проверена сервером");

      const teamResponse = await fetch("/api/teaminfo");
      
      if (!teamResponse.ok) {
        throw new Error("❌ Ошибка при получении данных о командах");
      }
    
      const teamData = await teamResponse.json();

      if (!teamData.teams) {
        throw new Error("❌ Ошибка: Команды не найдены");
      }

      const teamA: TeamData | null = teamData.teams.find((team: TeamData) => team.id === 1)|| null;
      const teamB: TeamData | null = teamData.teams.find((team: TeamData) => team.id === 2) || null;

      if (!teamA || !teamB) {
        throw new Error("Не удалось найти команды с id 1 и 2");
      }

      const { team } = await tools.DetermineTeam(teamA.bank, teamB.bank, teamA.players, teamB.players, amount)

      const teamId: number = (() => {
        switch (team) {
          case "Team1":
            return 1;
          case "Team2":
            return 2;
          default:
            throw new Error(`❌ Ошибка: '${team}' не является допустимым названием команды`);
        }
      })(); 
  
      // Отправляем пользователя в БД
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          amount: amount,
          transactionId: signature,
          team: teamId,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("✅ Пользователь добавлен в БД:", result);
        setStatus("JOINED")
        setCheck(true)
        
      } else {
        console.error("❌ Ошибка при добавлении в БД:", result.message);
        setStatus("JOIN")
      }
    } catch (error) {
      console.error("❌ Ошибка в joinGame:", error)
      setStatus("JOIN");
    }
  };

  

  return (
    <div className={styles.container}>

      {/* Поле ввода суммы */}
      <input
        type="number"
        step="0.01"
        min="0.01"
        max="5"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        onBlur={(e) => {
          let newValue = parseFloat(e.target.value);
      
          // Проверяем, что введено число и ограничиваем до 2 знаков после запятой
          if (!isNaN(newValue)) {
            newValue = Math.max(0.01, Math.min(5, newValue)); // Ограничиваем min/max
            newValue = parseFloat(newValue.toFixed(2)); // Оставляем 2 знака после запятой
            setValue(newValue);
          } else {
            setValue(0.01); // Если поле ввода стало пустым, ставим минимальное значение
          }
        }}
        className={styles.inputField}
      />


      {/* Ползунок (Slider) */}
      <input
        type="range"
        min="0.01"
        max="5"
        step="0.01"
        value={isNaN(value) ? 0.01 : value} // Если value NaN, ставим предыдущее значение
        onChange={(e) => {
          const newValue = parseFloat(e.target.value);
          if (!isNaN(newValue)) {
            setValue(newValue);
          }
          }}
        className={styles.slider}
        style={{
          background: `linear-gradient(90deg, #ff9900 ${(isNaN(value) ? 0.01 : value) / 5 * 100}%, #444 ${(isNaN(value) ? 0.01 : value) / 5 * 100}%)`
        }}
      />
      

      {/* Кнопка JOIN */}
      <button
        className={`${styles.ConnectButton} ${status == "JOINING..." ? styles.disabled : ""} ${status == "JOINED" ? styles.finished : ""}`}
        onClick={() => joinGame()}
        disabled={status !== "JOIN"}
      >
        {status}
      </button>
    </div>
  );

};

