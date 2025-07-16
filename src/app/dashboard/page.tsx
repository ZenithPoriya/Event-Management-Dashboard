"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import EventTable from "@/components/events/EventTable";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <EventTable />
    </ProtectedRoute>
  );
}
