import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, ActionError } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


export const GET = async (req: Request) => {


	const requestUrl = new URL(req.url);
	const multiplier = 1.1;
	const payload: ActionGetResponse = {
		title: "Rocket Blink",
		icon: new URL("/stage1.jpg", requestUrl.origin).toString(),
		description:
			"Multiplier: 1.1x\nEject = withdraw now \n Continue = increase multiplier\n",
		label: "Stage_1",
		links: {
			actions: [

				{
					label: "Continue",
					href: "/api/actions",
				},
				{
					label: "Eject",
					href: "/api/actions",
				},
			],
		},
	}

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,
	});
};


export const OPTIONS = GET;
// export const OPTIONS = async () => Response.json(null, ACTIONS_CORS_HEADERS);

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




