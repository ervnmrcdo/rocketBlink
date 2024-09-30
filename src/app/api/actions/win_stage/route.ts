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


	const payload: CompletedAction = {
		type: "completed",
		title: "You made it to the MOON!",
		icon: new URL("/win_stage.jpg", new URL(req.url).origin).toString(),
		label: "Complete!",
		description:
			`You have now completed an action chain! ` +
			`Here was the signature from the last action's transaction:  `,
	};
	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,
	});
}




