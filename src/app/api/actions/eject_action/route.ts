import { ActionError, CompletedAction, createActionHeaders, NextActionPostRequest, } from "@solana/actions";
// import { clusterApiUrl, Connection, PublicKey, } from "@solana/web3.js";


const headers = createActionHeaders();

export const GET = async () => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });
export const POST = async (req: Request) => {

  const url = new URL(req.url);

  /**
   * we can type the `body.data` to what fields we expect from the GET response above
   */
  const body: NextActionPostRequest = await req.json();

  // body will contain the user's `account` and `memo` input from the user
  console.log("body:", body);
  //

  const payload: CompletedAction = {
    type: "completed",
    title: "Ejected Successfully!",
    icon: new URL("/win_stage.png", url.origin).toString(),
    label: "Complete!",
    description:
      `\n\n                          You have successfully withdrawn. \n\n` +
      `                          Here is the transaction signature: \n\n `,
  };

  return Response.json(payload, {
    headers,
  });
}
