import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import MarketplaceProvider from "@/hooks/useMarketplaceContext";

export const metadata: Metadata = {
  title: "Fair Food Data Marketplace",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: "100px" }} suppressHydrationWarning={true}>
        <Providers>
          <MarketplaceProvider>
            <Navbar />
            {children}
          </MarketplaceProvider>
        </Providers>
      </body>
    </html>
  );
}
