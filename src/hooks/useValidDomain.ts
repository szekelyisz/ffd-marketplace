import { checkVaildDomain } from "@/actions/login";
import { useEffect, useState } from "react";

export function useValidDomain(walletAddress: `0x${string}` | undefined) {
  const [isBanned, setIsBanned] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    checkVaildDomain(walletAddress).then((banned) => setIsBanned(banned));
  });

  return isBanned;
}
