import "./globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { getServerSession } from "next-auth";

import SessionProvider from "../components/SessionProvider";
import NavMenu from "../components/NavMenu";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavMenu />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
