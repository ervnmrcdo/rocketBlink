import { Action, ActionError, ACTIONS_CORS_HEADERS, createActionHeaders, } from "@solana/actions";


const headers = createActionHeaders();

export const GET = async (req: Request) => {
	return Response.json({ message: "Method not supported" } as ActionError, {
		status: 403,
		headers,
	});

};


export const OPTIONS = async () => Response.json(null, { headers });
export const POST = async (req: Request) => {




	const requestUrl = new URL(req.url);

	const payload: Action = {
		type: "action",
		title: "Rocket Blink",
		icon: new URL("/stage8.jpg", requestUrl.origin).toString(),
		description:
			"Multiplier: 2x\nEject = withdraw now \nContinue = increase multiplier\n",
		label: "Stage_8",
		links: {
			actions: [

				{
					label: "Claim",
					href: `/api/actions/win_stage/win_stage_transaction`,
				},
			],
		},
	};

	return Response.json(payload, {
		headers: ACTIONS_CORS_HEADERS,
	});
}







