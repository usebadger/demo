import { BadgerClient } from "@usebadger/sdk";

/*
Create a badger client
*/
export const sdk = new BadgerClient({
  // Pass the public app id in
  appId: process.env.NEXT_PUBLIC_BADGER_APP_ID!,
  // If we're on the server, we can use the server-side-only app secret
  appSecret: process.env.BADGER_APP_SECRET,
});
