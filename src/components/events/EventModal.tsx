"use client";
import EventForm from "./EventForm";
import { Event } from "@/types/event";

type EventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
};

export default function EventModal({
  isOpen,
  onClose,
  event,
}: EventModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </button>
        <EventForm event={event} onClose={onClose} />
      </div>
    </div>
  );
}
