import { defineChain } from "thirdweb";

export const theChain = defineChain(
  Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID as string)
);
