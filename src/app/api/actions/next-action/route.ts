import { OPTIONS } from "@/app/actions.json/route";
import { ActionError, createActionHeaders, NextActionPostRequest } from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
	Response.json({ message: "Method not supported" } as ActionError, {
		status: 403,
		headers
	});
};



export OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
	const url = new URL(req.url);


	const body: NextActionPostRequest = await req.json();

	console.log("body:", body);

	let account: PublicKey;

	account = new PublicKey(body.account);

	let signature: string;
	try {
		signature = body.signature;
		if (!signature) throw "Invalid signature";
	} catch (err) {
		throw 'Invalid "signature" provided';
	}

	const CONNECTION = new Connection(clusterApiUrl("devnet"));

	let status = await CONNECTION.getSignatureStatus(signature);

	console.log("signature status", status);

	if (!status) throw "Unknown signature status";





}
