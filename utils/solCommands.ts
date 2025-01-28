import { publicKey } from './../node_modules/@solana/web3.js/src/layout';
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
  } from "@solana/spl-token";
  import * as fs from "fs";

  // // Playground wallet
  // const secret = JSON.parse(fs.readFileSync("ArttwtHob1nbRSKmNDwAjXopxHt3sJJQnyG9VwwTe1V2.json").toString()) as number[];
  // const secretKey = Uint8Array.from(secret);
  // const ownerKeypair = Keypair.fromSecretKey(secretKey);

  const mintKey = new PublicKey("A4XQecSZRv56f6kYHuySaDSw1rcYjMhf3PjKhUZw8CRK")
  const programId = new PublicKey('CmGfpBMrKC5dNGCF9kdyuuGu7Uewcrz3XsstQzmws7kN');

export class solCommands {

  static async CreateMultiSigTransaction(
    connection: Connection,
    feePayer: PublicKey,
    courierKey: PublicKey,
    recieverKey: PublicKey,
    backupKey: PublicKey,
    amount: number
  ): Promise<Transaction> {

    const multisigAccount = Keypair.generate();
    const m = 2;
    const signers = [courierKey, recieverKey];

    const createAccInstruction = SystemProgram.createAccount({
      fromPubkey: feePayer, // Оплачивает создание аккаунта
      newAccountPubkey: multisigAccount.publicKey, // Новый аккаунт
      space: MULTISIG_SIZE, // Размер аккаунта для мультиподписи
      lamports: await connection.getMinimumBalanceForRentExemption(MULTISIG_SIZE), // Лампорт для аренды
      programId: TOKEN_PROGRAM_ID, // Программа SPL Token
    })

    const multiSigInstruction = createInitializeMultisigInstruction(
      multisigAccount.publicKey, // Аккаунт мультиподписи
      signers, // Список подписантов
      m, // Минимум подписей
      TOKEN_PROGRAM_ID // Программа SPL Token
    )

    const associatedTokenSender = getAssociatedTokenAddressSync(
      mintKey,
      feePayer,
      true,
    );
    
    const associatedTokenReceiver = getAssociatedTokenAddressSync(
      mintKey,
      multisigAccount.publicKey,
      true,
    );

    const createMultisigATAInstruction = createAssociatedTokenAccountInstruction(
      feePayer,
      associatedTokenReceiver,
      multisigAccount.publicKey,
      mintKey,
    );

    const depositInstruction = createTransferInstruction(
      associatedTokenSender, // Отправитель (токен-аккаунт)
      associatedTokenReceiver, // Получатель (токен-аккаунт)
      feePayer, // Владельц (авторизует перевод)
      amount, // Количество токенов в долях
      [],
      TOKEN_PROGRAM_ID // Адрес программы SPL Token
    );
    
    const { blockhash } = await connection.getLatestBlockhash('finalized');
      console.log("Blockhash:", blockhash);
    
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: feePayer,
      })
    .add(createAccInstruction)
    .add(multiSigInstruction)
    .add(createMultisigATAInstruction)
    .add(depositInstruction);

    transaction.partialSign(multisigAccount);

  return transaction

  }

  static async confirmCashDelivery(
    connection: Connection,
    feePayer: PublicKey,
    multisigAddressCourier: PublicKey,
    multisigAddressReceiver: PublicKey,
    courierKey: PublicKey,
    recieverKey: PublicKey,
    senderKey: PublicKey,
    backupKey: PublicKey,
    amount: number
  ): Promise<Transaction> {


    const multisigAddressCourierAssociatedToken = getAssociatedTokenAddressSync(
      mintKey,
      multisigAddressCourier,
      true,
    );
    
    const associatedTokenCourier = getAssociatedTokenAddressSync(
      mintKey,
      courierKey,
      true,
    );

    const multisigAddressReceiverAssociatedToken = getAssociatedTokenAddressSync(
      mintKey,
      multisigAddressReceiver,
      true,
    );

    const associatedTokenSender = getAssociatedTokenAddressSync(
      mintKey,
      senderKey,
      true,
    );
    
    const returnDepositInstruction = createTransferInstruction(
      multisigAddressCourierAssociatedToken, // Токен-аккаунт мультиподписи
      associatedTokenCourier, // Токен-аккаунт получателя
      multisigAddressCourier, // Мультиподписной аккаунт (владелец)
      amount, // Количество токенов (например, 1 токен с decimal = 6)
      [courierKey, recieverKey], // Подписанты
      TOKEN_PROGRAM_ID
    );
    const sendDepositInstruction = createTransferInstruction(
      multisigAddressReceiverAssociatedToken, // Токен-аккаунт мультиподписи
      associatedTokenSender, // Токен-аккаунт получателя
      multisigAddressCourier, // Мультиподписной аккаунт (владелец)
      amount, // Количество токенов (например, 1 токен с decimal = 6)
      [courierKey, recieverKey], // Подписанты
      TOKEN_PROGRAM_ID
    );
  
    // Создаём транзакцию
    const { blockhash } = await connection.getLatestBlockhash('finalized');
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: feePayer,
    })
    .add(returnDepositInstruction)
    .add(sendDepositInstruction);
  
    // Подписываем транзакцию первым подписантом
    return transaction
  }


   
}
