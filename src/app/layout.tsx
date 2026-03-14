import type { Metadata } from "next";

import { StoreProvider } from "@/shared/providers/StoreProvider";
import { getCartForLayout } from "@/shared/utils/cartServer";
import "@/shared/styles/globals.scss";

import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "Lalasia",
  description: "Lalasia furniture store",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cart = await getCartForLayout();

  return (
    <html lang="en">
      <body>
        <div id="root">
          <StoreProvider initData={{ cart }}>
            <Header />
            {children}
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
