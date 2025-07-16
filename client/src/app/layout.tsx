import { Metadata } from "next";
import "./globals.css";
import { lato } from "./font";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import Providers from "@/providers/Providers";

export const metadata: Metadata = {
  title: "Homzystay",
  description:
    "Rental is one of the best property dealing website in local market of Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.className} antialiased`}>
        <Providers>
          <NextTopLoader showSpinner={false} color="#F15927" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
