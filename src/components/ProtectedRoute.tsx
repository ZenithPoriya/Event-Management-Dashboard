"use client";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPage = pathname === "/dashboard";

  if (!loading) {
    if (user && isAuthPage) {
      router.replace("/dashboard");
      return null;
    }

    if (!user && isProtectedPage) {
      router.replace("/login");
      return null;
    }
  }

  if (loading) return null;

  return <>{children}</>;
}
