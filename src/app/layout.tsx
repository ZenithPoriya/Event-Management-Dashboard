import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";
import "./globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";

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
      <body>
        <AuthProvider>
          <ProtectedRoute>
            <EventProvider>{children}</EventProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
