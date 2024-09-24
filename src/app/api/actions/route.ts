import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


export const GET = async (req: Request) => {


	try {
		const requestUrl = new URL(req.url);
		// const {validator} = validatedQueryParams(requestUrl);
		//
		// const baseHref = new URL(
		// 	`/api/actions/`
		// )

		const payload: ActionGetResponse = {
			title: "Rocket Blink",
			icon: new URL(" / rocket.png", requestUrl.origin).toString(),
			description: "To the MOON!",
			label: "Play",
			links: {
				actions: [

					{
						label: "Blast Off",
						href: "api/",
					},
					{
						label: "Eject",
						href: "api/",
					},
					{
						label: "Play",
						href: "api/",
						parameters: [
							{
								name: "amount",
								label: "Amount to play with in SOL"
							}
						]
					},
				]
			}
		}

		return Response.json(payload, {
			headers: ACTIONS_CORS_HEADERS,
		});
	} catch (err) {

	}
}


export const OPTONS = GET;

export const POST = async (req: Request) => {
	const body: ActionPostRequest = await req.json();


	const fromPubkey = new PublicKey(body.account);
	const toPubkey = new PublicKey("7AiCz3SEtk45dFQxzziFUS3SJEQFtNB4TzuG4QzjqXAh");
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
			message: "Sent 1 SOL",
		}
	});

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,

	});
}

