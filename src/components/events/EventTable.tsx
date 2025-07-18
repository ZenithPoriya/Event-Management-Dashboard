"use client";
import { useMemo, useState } from "react";
import { useEventContext } from "@/context/EventContext";
import EventModal from "./EventModal";
import { Event } from "@/types/event";
import { deleteEvent } from "@/utils/eventApi";
import { useSearchParams, useRouter } from "next/navigation";

export default function EventTable() {
  const { events, reloadEvents } = useEventContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search")?.toLowerCase() || "";
  const typeFilter = searchParams.get("type") || "";
  const categoryFilter = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "asc";

  const openAddModal = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      await reloadEvents();
    }
  };

  const filtered = useMemo(
    () =>
      events
        .filter(
          (e) =>
            e.title.toLowerCase().includes(search) ||
            e.description.toLowerCase().includes(search)
        )
        .filter((e) => (typeFilter ? e.eventType === typeFilter : true))
        .filter((e) => (categoryFilter ? e.category === categoryFilter : true))
        .sort((a, b) => {
          if (sort === "startDate") {
            const comp = a.startDateTime.localeCompare(b.startDateTime);
            return order === "asc" ? comp : -comp;
          }
          if (sort === "title") {
            const comp = a.title.localeCompare(b.title);
            return order === "asc" ? comp : -comp;
          }
          return 0;
        }),
    [events, categoryFilter, sort, order, search, typeFilter]
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) newParams.set(name, value);
    else newParams.delete(name);
    router.push("?" + newParams.toString());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Events</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by title or description"
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          name="type"
          defaultValue={typeFilter}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">All Types</option>
          <option value="Online">Online</option>
          <option value="In-Person">In-Person</option>
        </select>
        <select
          name="category"
          defaultValue={categoryFilter}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">All Categories</option>
          <option value="Social">Social</option>
          <option value="Personal">Personal</option>
          <option value="Business">Business</option>
        </select>
        <select
          name="sort"
          defaultValue={sort}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">Sort By</option>
          <option value="startDate">Start Date</option>
          <option value="title">Title</option>
        </select>
        <select
          name="order"
          defaultValue={order}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Event Link</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Start</th>
              <th className="p-2 text-left">End</th>
              <th className="p-2 text-left">Organizer</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.id} className="border-t">
                <td className="p-2 text-left">{event.title}</td>
                <td className="p-2 text-left">{event.description}</td>
                <td className="p-2 text-left">{event.eventType}</td>
                <td className="p-2 text-left">{event.category}</td>
                <td className="p-2 text-left">{event.eventLink || "-"}</td>
                <td className="p-2 text-left">{event.location || "-"}</td>
                <td className="p-2 text-left">{event.startDateTime}</td>
                <td className="p-2 text-left">{event.endDateTime}</td>
                <td className="p-2 text-left">{event.organizer}</td>
                <td className="p-2 text-left space-x-2">
                  <button
                    onClick={() => openEditModal(event)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent || undefined}
      />
    </div>
  );
}
