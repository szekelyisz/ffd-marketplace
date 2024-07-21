"use client";

import { ListingGrid } from "@/components/collection-page/ListingGrid";
import { Box, Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex>
      <Box mt="24px" m="auto">
        <ListingGrid />
      </Box>
    </Flex>
  );
}
