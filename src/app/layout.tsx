import type { Metadata } from "next";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import MarketplaceProvider from "@/hooks/useMarketplaceContext";

export const metadata: Metadata = {
  title: "trace.market Marketplace",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body style={{ paddingBottom: "100px" }}>
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
