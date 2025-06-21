"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EventCard } from "@/components/event-card";
import { SceneBot } from "@/components/scene-bot";
import { mockEvents } from "@/lib/mock-data";
import type { Event } from "@/lib/types";
import { isAfter } from "date-fns";
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const now = new Date();

    // Filter mock events for upcoming ones
    const upcomingMockEvents = mockEvents.filter(event => isAfter(new Date(event.date), now));

    // Set initial state with mock data to avoid empty page on first load and prevent layout shift
    setEvents(upcomingMockEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    
    if (db) {
      // If firebase is configured, listen for real-time updates
      const eventsCollection = collection(db, 'events');
      const q = query(
        eventsCollection,
        where('date', '>=', now.toISOString()),
        orderBy('date', 'asc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const firestoreEvents: Event[] = [];
        querySnapshot.forEach((doc) => {
          firestoreEvents.push({ id: doc.id, ...doc.data() } as Event);
        });

        // Combine mock data and firestore data, then de-duplicate
        const allEvents = [...upcomingMockEvents, ...firestoreEvents];
        const uniqueEvents = Array.from(new Map(allEvents.map(e => [e.id, e])).values());

        // Sort all events by date
        uniqueEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setEvents(uniqueEvents);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching events from Firestore: ", error);
        // Fallback to only mock events if there's an error and stop loading
        setIsLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      // If firebase is not configured, just show mock events and stop loading
      setIsLoading(false);
    }
  }, []);


  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-48 rounded-lg bg-muted"></div>
          <div className="h-8 w-2/3 rounded bg-muted mt-12"></div>
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

      {events.length > 0 && (
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Upcoming Events
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Check out these exciting events happening in Bangalore.
          </p>
          <div className="mt-8 space-y-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
