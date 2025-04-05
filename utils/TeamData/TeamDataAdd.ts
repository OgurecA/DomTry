import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as fs from "fs";
import * as borsh from "@project-serum/borsh"
import BN from "bn.js";

// === CONFIG ===
const PROGRAM_ID = new PublicKey("bW1954QvgnbhGsUhSAfhEy1HDuJbLicdTEwzMMFc37n"); // замени
const RPC_URL = "https://api.devnet.solana.com";

const TeamDataSchema = borsh.struct([
  borsh.u8("variant"),
  borsh.i64("team_a_score"),
  borsh.i64("team_b_score"),
  borsh.i64("last_updated"),
  borsh.str("team_a_name"),
  borsh.str("team_b_name")
])

const buffer = Buffer.alloc(100)
TeamDataSchema.encode({
  variant: 1,
  team_a_score: new BN(1435),
  team_b_score: new BN(1435),
  last_updated: new BN(1435),
  team_a_name: "Team A",
  team_b_name: "Team B"
}, buffer)

const instructionBuffer = buffer.subarray(0, TeamDataSchema.getSpan(buffer))

function loadPayer(): Keypair {
  const secret = JSON.parse(fs.readFileSync("ADiCp9b2BtHkt1PvipMjAmQfzThFMczwMzUtfYPNoY8b.json", "utf8"));
  return Keypair.fromSecretKey(Uint8Array.from(secret));
}

function generatePDA(publicKey: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [publicKey.toBuffer(), PROGRAM_ID.toBuffer()],
    PROGRAM_ID
  )
  return pda
}

(async () => {
  const payer = loadPayer();
  const pda = generatePDA(payer.publicKey)
  const connection = new Connection(RPC_URL, "confirmed");

  const ix = new TransactionInstruction({
    keys: [
      {
        pubkey: payer.publicKey,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: pda,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: SystemProgram.programId, // ✅ это правильный system_program
        isSigner: false,
        isWritable: false,
      }
    ], // нет аккаунтов — просто тест
    programId: PROGRAM_ID,
    data: instructionBuffer,
  });

  const tx = new Transaction().add(ix);

  const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log("✅ Instruction sent. Signature:", sig);
})();
