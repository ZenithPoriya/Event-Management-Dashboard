import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Event Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <EventProvider>{children}</EventProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
