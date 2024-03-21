import "./globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { getServerSession } from "next-auth";
import { SpeedInsights } from "@vercel/speed-insights/next";

import SessionProvider from "../components/SessionProvider";
import NavMenu from "../components/NavMenu";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Todos",
  description: "A list of todos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <NavMenu />
          {children}
        </SessionProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
