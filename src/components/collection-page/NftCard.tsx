import { NftMetadata } from "@/app/types/NftMetadata";
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Skeleton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import assert from "assert";
import React from "react";
import { MdAddShoppingCart } from "react-icons/md";
import useSWR from "swr";
import { DirectListing } from "thirdweb/extensions/marketplace";
import { useActiveAccount } from "thirdweb/react";
import BuyFromListingButton from "../token-page/BuyFromListingButton";

export function NftCard({ item }: { item: DirectListing }) {
  const fetcher = (url: string, ...args: any[]) =>
    fetch(url, ...args).then((res) => res.json());

  const { data: nftMetadata } = useSWR<NftMetadata>(
    `${process.env.NEXT_PUBLIC_MINTER_URL}/metadata/${item.tokenId}`,
    fetcher
  );

  const account = useActiveAccount();
  // assert(account !== undefined);

  return (
    <Card key={item.id} rounded="12px">
      <Skeleton isLoaded={nftMetadata !== undefined}>
        <Flex direction="column">
          {/* <MediaRenderer client={client} src={item.asset.metadata.image} /> */}
          <CardHeader>
            <Flex direction="row" align={"center"}>
              <Heading size="md">
                {nftMetadata?.content.instance.type ?? "Unknown item"}
              </Heading>
              {account && (
                <>
                  <Spacer />
                  <BuyFromListingButton account={account} listing={item}>
                    <Icon as={MdAddShoppingCart} />
                  </BuyFromListingButton>
                </>
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>
              {item.currencyValuePerToken.displayValue}{" "}
              {item.currencyValuePerToken.symbol}
            </Text>
          </CardBody>
        </Flex>
      </Skeleton>
    </Card>
  );
}
