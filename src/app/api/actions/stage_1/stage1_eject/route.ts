import { ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, createActionHeaders, ActionError, PostNextActionLink, NextActionPostRequest } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
	return Response.json({ message: "Method not supported" } as ActionError, {
		status: 403,
		headers,
	});
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
	const body: NextActionPostRequest = await req.json();

	console.log("body:", body);

	const ROCKETBLINK_KP = Keypair.fromSecretKey(bs58.decode("36yjjoLKbfLUSjS85koMXTAU8rUsJQuBzKLeKYXSFat6ixg32jyc3GViKknQxmrKQgHiP9qjeVzgUWauVGNawrzs"))
	const toPubkey = new PublicKey(body.account)
	const fromPubkey = ROCKETBLINK_KP.publicKey
	const connection = new Connection(clusterApiUrl("devnet"));

	const tx = new Transaction();

	tx.feePayer = fromPubkey;

	tx.add(
		SystemProgram.transfer({
			fromPubkey: fromPubkey,
			toPubkey: toPubkey,
			lamports: 0.000369 * LAMPORTS_PER_SOL,
		})
	);

	tx.recentBlockhash = (
		await connection.getLatestBlockhash()
	).blockhash;



	const payload: ActionPostResponse = await createPostResponse({
		fields: {
			transaction: tx,
			message: "Paid 0.000369 SOL",
			links: {
				next: {
					type: "post",
					href: "/api/actions/eject_action",
				}
			}
		}
	});


	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,

	});
}

