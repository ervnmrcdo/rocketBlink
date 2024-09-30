import { ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, createActionHeaders, ActionError, } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import bs58 from "bs58";

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

	const MULTIPLIER = 1.2
	const PLAYING_FEE: number = parseFloat(process.env.PLAYING_FEE ?? "") || 0;
	const RB_KP = Keypair.fromSecretKey(bs58.decode(process.env.RP_SK ?? ""));
	const fromPubkey = RB_KP.publicKey;
	const toPubkey = new PublicKey(body.account);
	const connection = new Connection(clusterApiUrl("devnet"));
	const lamports = MULTIPLIER * PLAYING_FEE * LAMPORTS_PER_SOL;

	const tx = new Transaction();

	tx.feePayer = toPubkey;

	tx.add(
		SystemProgram.transfer({
			fromPubkey: fromPubkey,
			toPubkey: toPubkey,
			lamports,
		})
	);

	console.log(MULTIPLIER)


	tx.recentBlockhash = (
		await connection.getLatestBlockhash()
	).blockhash;

	tx.sign(RB_KP);


	const payload: ActionPostResponse = await createPostResponse({
		fields: {
			transaction: tx,
			message: "Successfully ejected!",
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


