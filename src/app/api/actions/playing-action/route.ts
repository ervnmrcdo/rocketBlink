import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, ActionError } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


export const GET = async (req: Request) => {


	const requestUrl = new URL(req.url);
	const payload: ActionGetResponse = {
		title: "Rocket Blink",
		icon: new URL("/rocket.png", requestUrl.origin).toString(),
		description: "To the MOON!",
		label: "Play",
		links: {
			actions: [

				{
					label: "Blast Off",
					href: "/api/actions",
				},

			]
		}
	}

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,
	});
}


export const OPTIONS = GET;

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
			toPubkey: toPubkey,
			lamports: 0.5 * LAMPORTS_PER_SOL
		})
	);

	tx.recentBlockhash = (
		await connection.getLatestBlockhash()
	).blockhash;

	const payload: ActionPostResponse = await createPostResponse({
		fields: {
			transaction: tx,
			message: "Paid 0.5 SOL",
			links: {
				next: {
					type: "post",
					href: "api/actions/playing-action"
				}
			}
		}
	});

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,

	});
}



}
