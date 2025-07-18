"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { useAuth } from "@/context/AuthContext";
import { useEventContext } from "@/context/EventContext";
import { createEvent, updateEvent, fetchEvents } from "@/utils/eventApi";
import { generateId } from "@/utils/idGenerator";

export default function EventForm({
  event,
  onClose,
}: {
  event?: Event;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { reloadEvents } = useEventContext();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Event>({
    defaultValues: event || {},
  });

  useEffect(() => {
    if (event) reset(event);
  }, [event, reset]);

  const onSubmit = async (data: Event) => {
    if (!user) return;

    const allEvents = await fetchEvents();
    const hasConflict = allEvents.some(
      (e) =>
        e.organizer === user.email &&
        e.id !== data.id &&
        e.startDateTime < data.endDateTime &&
        e.endDateTime > data.startDateTime
    );

    if (hasConflict) {
      setError("Time conflict with another event.");
      return;
    }

    if (event) {
      await updateEvent(event.id, data);
    } else {
      await createEvent({ ...data, id: generateId(), organizer: user.email });
    }

    await reloadEvents();
    onClose();
    reset();
  };

  const eventType = watch("eventType");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-bold">
        {event ? "Edit Event" : "Add Event"}
      </h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block font-medium">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Event Type</label>
        <select
          {...register("eventType", { required: "Event type is required" })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Type</option>
          <option value="Online">Online</option>
          <option value="In-Person">In-Person</option>
        </select>
        {errors.eventType && (
          <p className="text-red-500 text-sm">{errors.eventType.message}</p>
        )}
      </div>

      {eventType === "Online" && (
        <div>
          <label className="block font-medium">Event Link</label>
          <input
            {...register("eventLink", {
              required: "Event link is required for online events",
            })}
            placeholder="Event Link"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.eventLink && (
            <p className="text-red-500 text-sm">{errors.eventLink.message}</p>
          )}
        </div>
      )}

      {eventType === "In-Person" && (
        <div>
          <label className="block font-medium">Location</label>
          <input
            {...register("location", {
              required: "Location is required for in-person events",
            })}
            placeholder="Location"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block font-medium">Start Date & Time</label>
        <input
          type="datetime-local"
          {...register("startDateTime", { required: "Start time is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.startDateTime && (
          <p className="text-red-500 text-sm">{errors.startDateTime.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">End Date & Time</label>
        <input
          type="datetime-local"
          {...register("endDateTime", { required: "End time is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.endDateTime && (
          <p className="text-red-500 text-sm">{errors.endDateTime.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Category</label>
        <select
          {...register("category", { required: "Category is required" })}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="Social">Social</option>
          <option value="Personal">Personal</option>
          <option value="Business">Business</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {user && (
        <div>
          <label className="block font-medium">Organizer</label>
          <input
            value={user.email}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {event ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
