import { ActionError, ACTIONS_CORS_HEADERS, CompletedAction, createActionHeaders, } from "@solana/actions";


const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  const url = new URL(req.url);


  const payload: CompletedAction = {
    type: "completed",
    title: "The rocket blew up!",
    icon: new URL("/win_stage.jpg", url.origin).toString(),
    label: "Defeat!",
    description:
      `u ded bru`,
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
}
