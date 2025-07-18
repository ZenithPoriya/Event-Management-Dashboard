import axios from "@/utils/axios";
import { Event } from "@/types/event";

export async function fetchEvents(): Promise<Event[]> {
  const res = await axios.get("/events");
  return res.data;
}

export async function createEvent(data: Event): Promise<Event> {
  const res = await axios.post("/events", data);
  return res.data;
}

export async function updateEvent(
  id: string,
  data: Partial<Event>
): Promise<Event> {
  const res = await axios.put(`/events/${id}`, data);
  return res.data;
}

export async function deleteEvent(id: string): Promise<void> {
  await axios.delete(`/events/${id}`);
}
