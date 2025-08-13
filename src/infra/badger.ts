import { BadgerClient } from "@usebadger/sdk";

export const badger = new BadgerClient({
  appId: process.env.NEXT_PUBLIC_BADGER_APP_ID!,
  appSecret: process.env.BADGER_APP_SECRET!,
  baseUrl: process.env.BADGER_API_URL || process.env.NEXT_PUBLIC_BADGER_API_URL,
});
