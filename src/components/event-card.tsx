import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);

  return (
    <Link href={`/events/${event.id}`} className="block group">
      <Card className="transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary/50 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src={event.imageUrl || "https://placehold.co/600x400.png"}
              alt={event.title}
              width={600}
              height={400}
              className="object-cover h-48 w-full md:h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={event["data-ai-hint"] || "event photo"}
            />
          </div>
          <div className="md:w-2/3">
            <CardHeader>
              <CardTitle className="font-headline text-2xl group-hover:text-primary">
                {event.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(eventDate, "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{format(eventDate, "p")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.address.split(',').slice(0, 2).join(', ')}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
}
