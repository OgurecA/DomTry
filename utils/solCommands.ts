import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
  } from "@solana/web3.js";
  import {
    setAuthority,
    AuthorityType,
    createAccount,
    TOKEN_PROGRAM_ID,
    mintTo,
    getOrCreateAssociatedTokenAccount,
    MULTISIG_SIZE,
    createInitializeMultisigInstruction,
    createTransferInstruction,
    getAssociatedTokenAddress,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
    createCloseAccountInstruction,
  } from "@solana/spl-token";
  import * as fs from "fs";

  // // Playground wallet
  // const secret = JSON.parse(fs.readFileSync("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2.json").toString()) as number[];
  // const secretKey = Uint8Array.from(secret);
  // const ownerKeypair = Keypair.fromSecretKey(secretKey);

  const pot = new PublicKey("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2");

export class solCommands {

  static async JoinGame(
    connection: Connection,
    player: PublicKey,
    amount: number
  ): Promise<{ transaction: Transaction, amount: number }> {


    const createAccInstruction = SystemProgram.transfer({
      fromPubkey: player,
      toPubkey: pot,
      lamports: LAMPORTS_PER_SOL * amount,
    })

    
    const { blockhash } = await connection.getLatestBlockhash('finalized');
      console.log("Blockhash:", blockhash);
    
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: player,
      })
    .add(createAccInstruction)

    return { transaction, amount };

  }
   
}
