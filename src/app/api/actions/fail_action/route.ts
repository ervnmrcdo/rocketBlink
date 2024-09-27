import { Action, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, CompletedAction, createActionHeaders, createPostResponse, NextActionPostRequest, } from "@solana/actions";
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
  const url = new URL(req.url);

  // const payload: Action = {
  //   type: "action",
  //   icon: new URL("/win_stage.jpg", url.origin).toString(),
  //   description: 'u ded bru',
  //   title: "The rocket blew up!",
  //   label: `Defeat!`,
  //   disabled: true,
  //
  // }

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
