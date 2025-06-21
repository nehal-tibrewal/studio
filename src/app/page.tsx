
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
import { generateEventImage } from '@/ai/flows/generate-event-image';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const now = new Date();

    // Filter mock events for upcoming ones
    let upcomingMockEvents = mockEvents.filter(event => isAfter(new Date(event.date), now));

    // Initial render with placeholders to prevent layout shift and show content quickly
    setEvents(upcomingMockEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    
    // Asynchronously generate images for the mock events
    upcomingMockEvents.forEach(event => {
      // Only generate if it's a placeholder
      if (event.imageUrl && (event.imageUrl.includes('placehold.co') || !event.imageUrl.startsWith('https'))) {
        generateEventImage({ title: event.title, description: event.description })
          .then(result => {
            if (result.imageUrl) {
              setEvents(currentEvents => 
                currentEvents.map(e => e.id === event.id ? { ...e, imageUrl: result.imageUrl } : e)
              );
            }
          })
          .catch(e => console.error(`Failed to generate image for ${event.title}:`, e));
      }
    });

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
        
        // Merge with current events, which may have AI images. Firestore data takes precedence.
        setEvents(currentEvents => {
          const eventsMap = new Map(currentEvents.map(e => [e.id, e]));
          firestoreEvents.forEach(fe => eventsMap.set(fe.id, fe));
          
          let combined = Array.from(eventsMap.values());
          combined = combined.filter(event => isAfter(new Date(event.date), now));
          combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          return combined;
        });

        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching events from Firestore: ", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);


  if (isLoading && events.length === 0) {
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
