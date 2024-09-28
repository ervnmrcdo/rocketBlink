import { ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, createActionHeaders, ActionError } from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
	return Response.json({ message: "Method not supported" } as ActionError, {
		status: 403,
		headers,
	});
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
	const body: ActionPostRequest = await req.json();


	const fromPubkey = new PublicKey(body.account);
	const toPubkey = new PublicKey(process.env.RB_PUBLIC_KP ?? "")
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
			message: "Continued to win stage",
			links: {
				next: {
					type: "post",
					href: "/api/actions/win_stage",
				}
			}
		}
	});

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,

	});
}


