"use client";
import { useState } from "react";
import { useEventContext } from "@/context/EventContext";
import EventModal from "@/components/events/EventModal";
import { Event } from "@/types/event";
import { deleteEvent } from "@/utils/eventApi";

export default function EventTable() {
  const { events, reloadEvents } = useEventContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Events</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th>Type</th>
            <th>Category</th>
            <th>Start</th>
            <th>End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t">
              <td className="p-2">{event.title}</td>
              <td>{event.eventType}</td>
              <td>{event.category}</td>
              <td>{event.startDateTime}</td>
              <td>{event.endDateTime}</td>
              <td className="space-x-2">
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

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent || undefined}
      />
    </div>
  );
}
