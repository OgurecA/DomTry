import {
    Connection,
    PublicKey,
  } from "@solana/web3.js";
  import * as borsh from "@project-serum/borsh"
  import BN from "bn.js";
  
  // === CONFIG ===
  const PROGRAM_ID = new PublicKey("bW1954QvgnbhGsUhSAfhEy1HDuJbLicdTEwzMMFc37n");
  const RPC_URL = "https://api.devnet.solana.com";
  
  const UserDataSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.i64("personal_score"),
    borsh.i64("team_score"),
    borsh.i64("last_updated"),
    borsh.u64("input"),
    borsh.str("team")
  ])
  
  // Укажи здесь конкретный адрес аккаунта, из которого хочешь достать данные
  const DATA_ACCOUNT_PUBKEY = new PublicKey("Ho5aRuzPyvv511sZD7Y7rj8tU9EcpSgPhhrvT9YNqDuu"); // ← вставь сюда свой Pubkey аккаунта
  
  (async () => {
    const connection = new Connection(RPC_URL, "confirmed");
  
    // Загружаем данные аккаунта
    const accountInfo = await connection.getAccountInfo(DATA_ACCOUNT_PUBKEY);
    if (!accountInfo) {
      console.log("❌ Account not found");
      return;
    }
  
    // Десериализуем
    const data = UserDataSchema.decode(accountInfo.data);
  
    console.log("✅ Данные из аккаунта:");
    console.log("is_initialized:", data.is_initialized);
    console.log("personal_score:", data.personal_score.toString());
    console.log("team_score:", data.team_score.toString());
    console.log("team:", data.team);
    console.log("input:", data.input.toString());
    console.log("last_updated:", data.last_updated.toString());
  })();
  