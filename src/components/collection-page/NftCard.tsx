import { NftMetadata } from "@/app/types/NftMetadata";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Link,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import {
  MdAddShoppingCart,
  MdAlarmOff,
  MdFactory,
  MdScale,
  MdSell,
} from "react-icons/md";
import { DirectListing } from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import BuyFromListingButton from "../token-page/BuyFromListingButton";
import { IconType } from "react-icons";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { gql, useQuery } from "urql";
import { Bee } from "@ethersphere/bee-js";
import { Pokedex } from "@fairfooddata/types";

type MetadataUpdated = {
  // id: string;
  tokenId: string;
  // owner: string;
  swarmHash: string;
  blockNumber: string;
  // blockTimestamp: string;
  // transactionHash: string;
};

export function NftCard({ item }: { item: DirectListing }): ReactNode {
  const [metadata, setMetadata] = useState<NftMetadata | undefined>(undefined);

  const [eventsRequest, reexecuteQuery] = useQuery<{
    metadataUpdateds: MetadataUpdated[];
  }>({
    query: gql`
      {
        metadataUpdateds(
          where: {
            tokenId: "${item.tokenId.toString()}"
          }
        ) {
          tokenId
          swarmHash
          blockNumber
        }
      }
    `,
    requestPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (eventsRequest.data) {
      eventsRequest.data.metadataUpdateds.sort(
        (a, b) =>
          Number.parseInt(b.blockNumber) - Number.parseInt(a.blockNumber)
      );

      const swarmHash = eventsRequest.data.metadataUpdateds[0].swarmHash;

      new Bee(process.env.NEXT_PUBLIC_SWARM_URL!)
        .downloadFile(
          BigInt(swarmHash).toString(16).padStart(64, "0"),
          undefined,
          { timeout: false }
        )
        .then((response) => {
          try {
            setMetadata({
              swarmReference: swarmHash,
              content: response.data.json() as unknown as Pokedex,
            });
          } catch {
            console.warn("Invalid metadata syntax");
            return;
          }
        });
    }
  }, [eventsRequest.data]);

  const account = useActiveAccount();

  return (
    <Card key={item.id} rounded="12px" w={300} position="relative">
      <Skeleton isLoaded={metadata !== undefined}>
        <Flex direction="column">
          {/* <MediaRenderer client={client} src={item.asset.metadata.image} /> */}
          <CardHeader pb={2}>
            <Flex direction="row" align={"center"}>
              <Heading size="md">
                <Link
                  href={`${process.env.NEXT_PUBLIC_PACKAGING_URL}/?tokenId=${item.tokenId}`}
                >
                  {metadata?.content.instance.type ?? "Unknown item"}{" "}
                  <ExternalLinkIcon mx="2px" boxSize={4} />
                </Link>
              </Heading>
              {account && (
                <Box position="absolute" top="4" right="4">
                  <BuyFromListingButton account={account} listing={item}>
                    <Icon as={MdAddShoppingCart} />
                  </BuyFromListingButton>
                </Box>
              )}
            </Flex>
          </CardHeader>
          <CardBody pt={0}>
            <NftData icon={MdScale}>
              <Text>{metadata?.content.instance.quantity}</Text>
            </NftData>
            <NftData icon={MdAlarmOff}>
              <Text>
                {new Date(
                  (metadata?.content.instance.expiryDate ?? 0) * 1000
                ).toDateString()}
              </Text>
            </NftData>
            <NftData icon={MdFactory}>
              <Link
                isExternal
                href={`${process.env.NEXT_PUBLIC_BRANDPAGE_URL}/?ownerId=${metadata?.content.instance.ownerId}`}
              >
                {metadata?.content.instance.ownerId}{" "}
                <ExternalLinkIcon mx="2px" boxSize={4} verticalAlign={"-15%"} />
              </Link>
            </NftData>
            <NftData icon={MdSell}>
              <Text>{`${item.currencyValuePerToken.displayValue} ${item.currencyValuePerToken.symbol}`}</Text>
            </NftData>
          </CardBody>
        </Flex>
      </Skeleton>
    </Card>
  );
}

function NftData({
  icon,
  children,
}: {
  icon: IconType;
  children: ReactNode;
}): ReactNode {
  return (
    <Flex alignItems={"center"} gap={2}>
      <Icon as={icon} />
      {children}
    </Flex>
  );
}
