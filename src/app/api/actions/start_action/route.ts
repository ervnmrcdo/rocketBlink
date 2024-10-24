import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, } from "@solana/actions";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


export const GET = async (req: Request) => {


	const requestUrl = new URL(req.url);
	const payload: ActionGetResponse = {
		title: "Rocket Blink (Devnet) ",
		icon: new URL("/rocket.png", requestUrl.origin).toString(),
		description: "To the MOON!\n" +
			`\nWARNING: DO NOT RELOAD PAGE WHILE IN THE MIDDLE OF THE GAME!` +
			`\n\nMECHANICS:` +
			`\n1. Press \"Blast Off\" to start playing.` +
			`\n2. The game will have a total of 3 stages.` +
			`\n3. Each stage the height of the rocket increases.` +
			`\n4. The catch is with every increase in height the risk of the rocket exploding increases.`,
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

	// const PLAYING_FEE: number = parseFloat(process.env.PLAYING_FEE ?? "") || 0;
	const PLAYING_FEE: number = 0.001;
	const fromPubkey = new PublicKey(body.account);
	const toPubkey = new PublicKey(process.env.RB_PUBLIC_KP ?? "");
	const connection = new Connection(clusterApiUrl("devnet"));

	const tx = new Transaction();

	tx.feePayer = fromPubkey;

	tx.add(
		SystemProgram.transfer({
			fromPubkey: fromPubkey,
			toPubkey: toPubkey,
			lamports: PLAYING_FEE * LAMPORTS_PER_SOL,
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
