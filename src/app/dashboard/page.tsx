"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="p-10">
        <h1 className="text-2xl mb-4">Welcome, {user?.email}</h1>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 text-white rounded"
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}
