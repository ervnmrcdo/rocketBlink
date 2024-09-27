import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, } from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


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
					href: "/api/actions/start_action",
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

	const toPubkey = new PublicKey("G24nEUyiBhmrEMbnsa82DQyoSvHuDsoJeSRRxiVbyFdZ")
	const fromPubkey = new PublicKey(body.account);
	const connection = new Connection(clusterApiUrl("devnet"));

	const tx = new Transaction();

	tx.feePayer = fromPubkey;

	tx.add(
		SystemProgram.transfer({
			fromPubkey: fromPubkey,
			toPubkey: toPubkey,
			lamports: await connection.getMinimumBalanceForRentExemption(0),
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
					href: "/api/actions/stage_1",
				}
			}
		}
	});

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,

	});
}
