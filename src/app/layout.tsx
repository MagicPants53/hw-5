import type { Metadata } from "next";

import { StoreProvider } from "@/shared/providers/StoreProvider";
import Header from "./_components/Header";

import "@/shared/styles/globals.scss";

export const metadata: Metadata = {
  title: "Lalasia",
  description: "Lalasia furniture store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <StoreProvider>
            <Header />
            {children}
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
