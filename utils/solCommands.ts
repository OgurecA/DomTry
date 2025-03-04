import { createAssociatedTokenAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
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

  // // Playground wallet
  // const secret = JSON.parse(fs.readFileSync("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2.json").toString()) as number[];
  // const secretKey = Uint8Array.from(secret);
  // const ownerKeypair = Keypair.fromSecretKey(secretKey);

  const pot = new PublicKey("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2");
  const mint = new PublicKey("7zWihHxBBDuUBfya4b2wWfdhXr5CFsefn1mywodoS3od");

export class solCommands {

  static async JoinGame(
    connection: Connection,
    player: PublicKey,
    amount: number
  ): Promise<{ transaction: Transaction, amount: number }> {


    const potTokenAccount = await getAssociatedTokenAddress(
      mint, // Адрес токена (mint)
      pot, // Владелец аккаунта (player)
      false, // Allow owner off curve (обычно false для стандартных случаев)
      TOKEN_PROGRAM_ID // Программа токенов Solana
    );

    const playerTokenAccount = await getAssociatedTokenAddress(
      mint, // Адрес токена (mint)
      player, // Владелец аккаунта (player)
      false, // Allow owner off curve (обычно false для стандартных случаев)
      TOKEN_PROGRAM_ID // Программа токенов Solana
    );

    // const accountInfo = await connection.getAccountInfo(playerTokenAccount);

    
    const createAccInstruction = createTransferInstruction(
      playerTokenAccount, // Отправитель (аккаунт игрока)
      potTokenAccount, // Получатель (аккаунт пота)
      player, // Владелец отправляющего аккаунта (игрок, для подписи)
      amount * 10 ** 3, // Количество токенов в минимальных единицах (для SOL или токена с 9 decimals, например)
      [], // Мультиподпись (пустой массив, если нет)
      TOKEN_PROGRAM_ID // Программа токенов
    );
    
    // const createAtaInstruction = createAssociatedTokenAccountInstruction(
    //   player, // Плательщик (пользователь, который оплачивает создание ATA)
    //   playerTokenAccount, // Адрес нового ATA
    //   player, // Владелец ATA (тот же пользователь)
    //   mint, // Адрес токена
    //   TOKEN_PROGRAM_ID // Программа токенов
    // );
    
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    console.log("Blockhash:", blockhash);
    
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: player,
    })

    // if (accountInfo === null) {
    //   transaction.add(createAtaInstruction);
    // }

    transaction.add(createAccInstruction)

    return { transaction, amount };

  }

   
}
