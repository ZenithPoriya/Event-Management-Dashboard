export type EventType = "Online" | "In-Person";

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: EventType;
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: string;
  organizer: string;
}
