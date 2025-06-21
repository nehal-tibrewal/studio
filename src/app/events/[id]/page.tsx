import Image from "next/image";
import { notFound } from "next/navigation";
import { mockEvents } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag, MapPin } from "lucide-react";
import { format } from "date-fns";
import { EventMap } from "@/components/event-map";

interface EventPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return mockEvents.map((event) => ({
    id: event.id,
  }));
}

export default function EventPage({ params }: EventPageProps) {
  const event = mockEvents.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={event.imageUrl || "https://placehold.co/1280x720.png"}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint={event["data-ai-hint"] || "event poster"}
          />
        </div>

        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {event.title}
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
           <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span>{format(eventDate, "p")} onwards</span>
            </div>
        </div>
        
        <div className="flex items-center gap-3 text-lg text-muted-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{event.address}</span>
        </div>

        <div className="prose prose-lg max-w-none text-foreground">
            <p>{event.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-primary" />
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="font-headline text-2xl font-bold mb-4">Location</h2>
          <EventMap address={event.address} />
        </div>
      </div>
    </div>
  );
}
