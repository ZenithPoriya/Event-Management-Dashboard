import React, { Dispatch, SetStateAction } from 'react';
import { deleteEvent } from '@/utils/eventApi';
import { useEventContext } from '@/context/EventContext';
import { Event } from '@/types/event';

const EventTable = ({
  setSelectedEvent,
  setModalOpen,
  filtered,
}: {
  setSelectedEvent: Dispatch<SetStateAction<Event | null>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  filtered: Event[];
}) => {
  const { reloadEvents } = useEventContext();

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
      await reloadEvents();
    }
  };

  return (
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
            <td className="p-2 text-left">{event.eventLink || '-'}</td>
            <td className="p-2 text-left">{event.location || '-'}</td>
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
  );
};

export default EventTable;
