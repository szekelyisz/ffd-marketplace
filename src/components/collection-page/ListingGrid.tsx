import { useMarketplaceContext } from "@/hooks/useMarketplaceContext";
import { Center, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { NftCard } from "./NftCard";
import { useActiveAccount } from "thirdweb/react";
import { useValidDomain } from "@/hooks/useValidDomain";

export function ListingGrid() {
  const activeAccount = useActiveAccount();

  const validDomain = useValidDomain(activeAccount?.address);

  const { listingsInSelectedCollection } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;
  const columns = useBreakpointValue({
    base: 1,
    sm: Math.min(len, 2),
    md: Math.min(len, 4),
    lg: Math.min(len, 4),
    xl: Math.min(len, 5),
  });

  return validDomain === false ? (
    <Center>Please don't use disposable email domains with our service.</Center>
  ) : listingsInSelectedCollection.length > 0 ? (
    <SimpleGrid columns={columns} spacing={4} p={4} mx="auto" mt="20px">
      {listingsInSelectedCollection.map((item) => (
        <NftCard item={item} key={item.id} />
      ))}
    </SimpleGrid>
  ) : (
    <Center>No NFTs listed for sale</Center>
  );
}
