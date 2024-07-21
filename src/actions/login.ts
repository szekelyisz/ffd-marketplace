"use server";
import { VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "@/consts/client";
import { cookies } from "next/headers";
import bannedDomains from "@/actions/BannedDomains.json";

const privateKey = process.env.THIRDWEB_ADMIN_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKeyToAccount({ client, privateKey }),
  client: client,
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
    });
    cookies().set("jwt", jwt);
  }
}

export async function isLoggedIn() {
  const jwt = cookies().get("jwt");
  if (!jwt?.value) {
    return false;
  }

  return (await thirdwebAuth.verifyJWT({ jwt: jwt.value })).valid;
}

export async function logout() {
  cookies().delete("jwt");
}

export async function checkVaildDomain(
  walletAddress: `0x${string}` | undefined
) {
  if (walletAddress === undefined) {
    return Promise.resolve(undefined);
  }

  const url = new URL(
    "https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details"
  );
  url.searchParams.set("queryBy", "walletAddress");
  url.searchParams.set("walletAddress", walletAddress);

  return fetch(url.href, {
    headers: {
      Authorization: `Bearer ${process.env.THIRDWEB_SECRET_KEY}`,
    },
  })
    .then((response) => response.json())
    .then(
      (
        data: {
          userId: string;
          walletAddress: string;
          email?: string;
          phone?: string;
          createdAt: string;
        }[]
      ) => {
        if (data.length < 1 || data[0].email === undefined) return undefined;

        const domain = data[0].email.split("@").pop();

        if (domain === undefined) return undefined;

        return !bannedDomains.includes(domain);
      }
    );
}
