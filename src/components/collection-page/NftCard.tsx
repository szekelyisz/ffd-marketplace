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
import React, { ReactNode } from "react";
import {
  MdAddShoppingCart,
  MdAlarmOff,
  MdFactory,
  MdScale,
  MdSell,
} from "react-icons/md";
import useSWR from "swr";
import { DirectListing } from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import BuyFromListingButton from "../token-page/BuyFromListingButton";
import { IconType } from "react-icons";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export function NftCard({ item }: { item: DirectListing }): ReactNode {
  const fetcher = (url: string, ...args: any[]) =>
    fetch(url, ...args).then((res) => res.json());

  const { data: nftMetadata } = useSWR<NftMetadata>(
    `${process.env.NEXT_PUBLIC_MINTER_URL}/metadata/${item.tokenId}`,
    fetcher
  );

  const account = useActiveAccount();

  return (
    <Card key={item.id} rounded="12px" w={300} position="relative">
      <Skeleton isLoaded={nftMetadata !== undefined}>
        <Flex direction="column">
          {/* <MediaRenderer client={client} src={item.asset.metadata.image} /> */}
          <CardHeader pb={2}>
            <Flex direction="row" align={"center"}>
              <Heading size="md">
                <Link
                  href={`${process.env.NEXT_PUBLIC_PACKAGING_URL}/?tokenId=${item.id}`}
                >
                  {nftMetadata?.content.instance.type ?? "Unknown item"}{" "}
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
              <Text>{nftMetadata?.content.instance.quantity}</Text>
            </NftData>
            <NftData icon={MdAlarmOff}>
              <Text>
                {new Date(
                  (nftMetadata?.content.instance.expiryDate ?? 0) * 1000
                ).toDateString()}
              </Text>
            </NftData>
            <NftData icon={MdFactory}>
              <Link
                isExternal
                href={`${process.env.NEXT_PUBLIC_BRANDPAGE_URL}/?ownerId=${nftMetadata?.content.instance.ownerId}`}
              >
                {nftMetadata?.content.instance.ownerId}{" "}
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
