"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Event } from "@/types/event";
import { fetchEvents } from "@/utils/eventApi";

type EventContextType = {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  reloadEvents: () => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const reloadEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  useEffect(() => {
    reloadEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, setEvents, reloadEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context)
    throw new Error("useEventContext must be used in EventProvider");
  return context;
};
