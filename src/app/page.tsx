"use client";

import { useState, useEffect } from 'react';
import { EventCard } from "@/components/event-card";
import { SceneBot } from "@/components/scene-bot";
import { mockEvents } from "@/lib/mock-data";
import type { Event } from "@/lib/types";
import { isAfter } from "date-fns";
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const now = new Date();
    
    // Filter for all future events and sort them by date
    const filteredEvents = mockEvents
      .filter(event => isAfter(new Date(event.date), now))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setUpcomingEvents(filteredEvents);
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
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-12">
      <SceneBot />

      <Separator />

      {upcomingEvents.length > 0 && (
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Upcoming Events
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Check out these exciting events happening in Bangalore.
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
