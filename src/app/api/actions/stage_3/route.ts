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


	const NEXT_STAGE = successProbability(1, 100);

	console.log(NEXT_STAGE)

	const requestUrl = new URL(req.url);

	const payload: Action = {
		type: "action",
		title: "Rocket Blink",
		icon: new URL("/stage3.jpg", requestUrl.origin).toString(),
		description:
			"Multiplier: 1.4x\nEject = withdraw now \nContinue = increase multiplier\n",
		label: "Stage_3",
		links: {
			actions: [

				{
					label: "Eject",
					href: `/api/actions/stage_3/stage3_eject`,
				},
				{
					label: "Continue",
					href: `/api/actions/${NEXT_STAGE}`,
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

	if (RANDOM_NUM > 1) {
		return "stage_3/stage3_continue"
	} else {
		return "fail_action/fail_action_continue"
	}

}




