"use client";

import { useState, useEffect } from 'react';
import { EventCard } from "@/components/event-card";
import { SceneBot } from "@/components/scene-bot";
import { mockEvents } from "@/lib/mock-data";
import type { Event } from "@/lib/types";
import { addHours, isAfter } from "date-fns";

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [showSceneBot, setShowSceneBot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    const threeHoursFromNow = addHours(now, 3);
    
    const filteredEvents = mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return isAfter(eventDate, now) && isAfter(threeHoursFromNow, eventDate);
    });

    setUpcomingEvents(filteredEvents);
    setShowSceneBot(filteredEvents.length === 0);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-2/3 rounded bg-muted"></div>
          <div className="space-y-6">
            <div className="h-48 rounded-lg bg-muted"></div>
            <div className="h-48 rounded-lg bg-muted"></div>
            <div className="h-48 rounded-lg bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {showSceneBot ? (
        <SceneBot />
      ) : (
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Happening Soon
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Events happening in the next 3 hours near you.
          </p>
          <div className="mt-8 space-y-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
