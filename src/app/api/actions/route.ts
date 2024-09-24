import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, ActionError } from "@solana/actions";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { DEFAULT_SOL_ADDRESS, DEFAULT_SOL_AMOUNT } from "./const";


export const GET = async (req: Request) => {


	// try {
	const requestUrl = new URL(req.url);
	// const { toPubkey } = validatedQueryParams(requestUrl);

	// const baseHref = new URL(
	// 	`/api/actions?to=${toPubkey.toBase58()}`,
	// 	requestUrl.origin,
	// ).toString();
	//
	const payload: ActionGetResponse = {
		title: "Rocket Blink",
		icon: new URL("/rocket.png", requestUrl.origin).toString(),
		description: "To the MOON!",
		label: "Play",
		links: {
			actions: [

				{
					label: "Blast Off",
					href: "api/actions"
					// href: `${baseHref}&amount=${"0.05"}`,
				},
				{
					label: "Eject",
					href: "api/",
				},
			]
		}
	}

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,
	});
	// } catch (err) {
	// 	let actionError: ActionError = { message: "An unknow error occured" };
	// 	if (typeof err == "string") actionError.message = err;
	// 	return Response.json(actionError, {
	// 		status: 400,
	// 		headers: ACTIONS_CORS_HEADERS,
	// 	})
	// }
}


export const OPTONS = GET;

export const POST = async (req: Request) => {
	const requestUrl = new URL(req.url);
	// const { amount, toPubkey } = validatedQueryParams(requestUrl);
	const body: ActionPostRequest = await req.json();


	const toPubkey = new PublicKey("7AiCz3SEtk45dFQxzziFUS3SJEQFtNB4TzuG4QzjqXAh")
	const fromPubkey = new PublicKey(body.account);
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
			message: "Sent 1 SOL",
		}
	});

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,

	});
}

function validatedQueryParams(requestUrl: URL) {
	let toPubkey: PublicKey = DEFAULT_SOL_ADDRESS;
	let amount: number = DEFAULT_SOL_AMOUNT;

	try {
		if (requestUrl.searchParams.get("to")) {
			toPubkey = new PublicKey(requestUrl.searchParams.get("to")!);
		}
	} catch (err) {
		throw "Invalid input query parameter: to";
	}

	try {
		if (requestUrl.searchParams.get("amount")) {
			amount = parseFloat(requestUrl.searchParams.get("amount")!);
		}

		if (amount <= 0) throw "amount is too small";
	} catch (err) {
		throw "Invalid input query parameter: amount";
	}

	return {
		amount,
		toPubkey,
	};
}
