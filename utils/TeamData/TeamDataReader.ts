import {
    Connection,
    PublicKey,
  } from "@solana/web3.js";
  import * as borsh from "@project-serum/borsh"
  import BN from "bn.js";
  
  // === CONFIG ===
  const PROGRAM_ID = new PublicKey("bW1954QvgnbhGsUhSAfhEy1HDuJbLicdTEwzMMFc37n");
  const RPC_URL = "https://api.devnet.solana.com";
  
  const TeamDataSchema = borsh.struct([
    borsh.bool("is_initialized"),
    borsh.i64("team_a_score"),
    borsh.i64("team_b_score"),
    borsh.i64("last_updated"),
    borsh.str("team_a_name"),
    borsh.str("team_b_name")
  ]);
  
  // Укажи здесь конкретный адрес аккаунта, из которого хочешь достать данные
  const DATA_ACCOUNT_PUBKEY = new PublicKey("7LXsYtjs4D9u89pqukSa2hZSdxrqeoWFSswVVtrsYMdu"); // ← вставь сюда свой Pubkey аккаунта
  
  (async () => {
    const connection = new Connection(RPC_URL, "confirmed");
  
    // Загружаем данные аккаунта
    const accountInfo = await connection.getAccountInfo(DATA_ACCOUNT_PUBKEY);
    if (!accountInfo) {
      console.log("❌ Account not found");
      return;
    }
  
    // Десериализуем
    const data = TeamDataSchema.decode(accountInfo.data);
  
    console.log("✅ Данные из аккаунта:");
    console.log("is_initialized:", data.is_initialized);
    console.log("team_a_name:", data.team_a_name);
    console.log("team_a_score:", data.team_a_score.toString());
    console.log("team_b_name:", data.team_b_name);
    console.log("team_b_score:", data.team_b_score.toString());
    console.log("last_updated:", data.last_updated.toString());
  })();
  