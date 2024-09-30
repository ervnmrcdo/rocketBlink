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

  // let account: PublicKey;
  // try {
  //   account = new PublicKey(body.account);
  // } catch (err) {
  //   throw 'Invalid "account" provided';
  // }
  //
  // let signature: string;
  // try {
  //   signature = body.signature;
  //   if (!signature) throw "Invalid signature";
  // } catch (err) {
  //   throw 'Invalid "signature" provided';
  // }
  //
  // const connection = new Connection(clusterApiUrl("devnet"),
  // );
  //
  // /**
  //  * todo: do we need to manually re-confirm the transaction?
  //  * todo: do we need to perform multiple confirmation attempts
  //  */
  //
  // try {
  //   let status = await connection.getSignatureStatus(signature);
  //
  //   console.log("signature status:", status);
  //
  //   if (!status) throw "Unknown signature status";
  //
  //   // only accept `confirmed` and `finalized` transactions
  //   if (status.value?.confirmationStatus) {
  //     if (
  //       status.value.confirmationStatus != "confirmed" &&
  //       status.value.confirmationStatus != "finalized"
  //     ) {
  //       throw "Unable to confirm the transaction";
  //     }
  //   }
  //
  //   // todo: check for a specific confirmation status if desired
  //   // if (status.value?.confirmationStatus != "confirmed")
  // } catch (err) {
  //   if (typeof err == "string") throw err;
  //   throw "Unable to confirm the provided signature";
  // }
  //
  // /**
  //  * !TAKE CAUTION!
  //  *
  //  * since any client side request can access this public endpoint,
  //  * a malicious actor could provide a valid signature that does NOT
  //  * perform the previous action's transaction.
  //  *
  //  * todo: validate this transaction is what you expected the user to perform in the previous step
  //  */
  //
  // // manually get the transaction to process and verify it
  // const transaction = await connection.getParsedTransaction(
  //   signature,
  //   "confirmed",
  // );
  //

  const payload: CompletedAction = {
    type: "completed",
    title: "Ejected Successfully!",
    icon: new URL("/win_stage.jpg", url.origin).toString(),
    label: "Complete!",
    description:
      `\n\n                          You have successfully withdrawn. \n\n` +
      `                          Here is the transaction signature: \n\n `,
    // `${signature}`,
  };

  return Response.json(payload, {
    headers,
  });
}

//   } catch (err) {
//     console.log(err);
//     let actionError: ActionError = { message: "An unknown error occurred" };
//     if (typeof err == "string") actionError.message = err;
//     return Response.json(actionError, {
//       status: 400,
//       headers,
//     });
//   }
// };
