import { isLoggedIn, login, generatePayload, logout } from "@/actions/login";
import { client } from "@/consts/client";
import { useColorMode } from "@chakra-ui/react";
import { ConnectButton as ThirdwebConnectButton } from "thirdweb/react";

export function ConnectButton() {
  const { colorMode } = useColorMode();

  return (
    <ThirdwebConnectButton
      client={client}
      theme={colorMode}
      connectButton={{ style: { height: "56px" } }}
      auth={{
        isLoggedIn: async (address) => {
          console.log("checking if logged in!", { address });
          return await isLoggedIn();
        },
        doLogin: async (params) => {
          console.log("logging in!");
          await login(params);
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => {
          console.log("logging out!");
          await logout();
        },
      }}
    />
  );
}
