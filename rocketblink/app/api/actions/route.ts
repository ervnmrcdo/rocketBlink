import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


export const GET = async () => {

	const payload: ActionGetResponse = {
		title: "Rocket Blink",
		icon: "",
		description: "",
		label: "",
	}

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,
	});
}


export const OPTONS = GET;

export const POST = async (req: Request) => {
	const body: ActionPostRequest = await req.json();


	const fromPubkey = new PublicKey(body.account);
	const toPubkey = new PublicKey("WALLET_ADDRESS");
	const connection = new Connection(clusterApiUrl("devnet"));

	const tx = new Transaction();

	tx.feePayer = fromPubkey;

	tx.add(
		SystemProgram.transfer({
			fromPubkey: fromPubkey,
			toPubkey: toPubkey,
			lamports: 1 * LAMPORTS_PER_SOL
		})
	);

	tx.recentBlockhash = (
		await connection.getLatestBlockhash()
	).blockhash;

	const payload: ActionPostResponse = await createPostResponse({
		fields: {
			transaction: tx,
			message: `Sent 1 SOL`,
		},
	}
	);

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,

	});
}

