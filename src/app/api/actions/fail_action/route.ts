import { ActionError, ActionPostRequest, ACTIONS_CORS_HEADERS, CompletedAction, createActionHeaders, } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


const headers = createActionHeaders();

export const GET = async () => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });

};


export const OPTIONS = async () => Response.json(null, { headers });
export const POST = async (req: Request) => {
  const body: ActionPostRequest = await req.json();


  const fromPubkey = new PublicKey(body.account);
  const toPubkey = Keypair.generate();
  const connection = new Connection(clusterApiUrl("devnet"));

  const tx = new Transaction();

  tx.feePayer = fromPubkey;

  tx.add(
    SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey.publicKey,
      lamports: 0.001 * LAMPORTS_PER_SOL
    })
  );

  tx.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  const url = new URL(req.url);

  const payload: CompletedAction = {
    type: "completed",
    title: "Oh no!",
    icon: new URL("/explosion.gif", url.origin).toString(),
    label: "Defeat!",
    description:
      `The rocket blew up! GG`,
  };


  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
}



