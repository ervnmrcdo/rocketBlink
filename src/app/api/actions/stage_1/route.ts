import { Action, ActionError, ActionPostRequest, ACTIONS_CORS_HEADERS, createActionHeaders, } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


const headers = createActionHeaders();

export const GET = async (req: Request) => {
	return Response.json({ message: "Method not supported" } as ActionError, {
		status: 403,
		headers,
	});

};


export const OPTIONS = async () => Response.json(null, { headers });
export const POST = async (req: Request) => {


	const NEXT_STAGE = successProbability(1, 100);

	console.log(NEXT_STAGE)

	const requestUrl = new URL(req.url);

	const payload: Action = {
		type: "action",
		title: "Rocket Blink",
		icon: new URL("/stage1.jpg", requestUrl.origin).toString(),
		description:
			"Multiplier: 1.1x\nEject = withdraw now \nContinue = increase multiplier\n",
		label: "Stage_1",
		links: {
			actions: [

				{
					label: "Eject",
					href: `/api/actions/stage_1/stage1_eject`,
				},
				{
					label: "Continue",
					href: `/api/actions/stage_1/${NEXT_STAGE}`,
				},
			],
		},
	};

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,
	});
}


function successProbability(min: number, max: number): string {
	const RANDOM_NUM: number = Math.random() * (max - min) + min;

	if (RANDOM_NUM > 30) {
		return "stage1_continue"
	} else {
		return "win_stage"
	}

}



