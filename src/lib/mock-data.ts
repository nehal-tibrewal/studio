import type { Event } from "./types";
import { addHours, formatISO } from "date-fns";

const now = new Date();

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Indie Music Showcase",
    description:
      "Discover the best of Bangalore's indie music scene. An evening of live performances from up-and-coming artists. Refreshments available.",
    address: "100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    date: formatISO(addHours(now, 1)),
    tags: ["Music", "Live", "Indie"],
    imageUrl: "https://placehold.co/600x400.png",
    "data-ai-hint": "music concert",
  },
  {
    id: "2",
    title: "Startup Founders Meetup",
    description:
      "Network with fellow entrepreneurs, investors, and innovators. Share your ideas, learn from experts, and build valuable connections.",
    address: "Cyber City, Magarpatta, Hadapsar, Pune, Maharashtra 411028",
    date: formatISO(addHours(now, 2.5)),
    tags: ["Tech", "Networking", "Business"],
    imageUrl: "https://placehold.co/600x400.png",
    "data-ai-hint": "business meeting",
  },
  {
    id: "3",
    title: "Open Mic Comedy Night",
    description:
      "Laugh your heart out with the city's funniest comedians. Sign up for a slot if you're feeling brave!",
    address: "80 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034",
    date: formatISO(addHours(now, 5)),
    tags: ["Comedy", "Open Mic", "Entertainment"],
    imageUrl: "https://placehold.co/600x400.png",
    "data-ai-hint": "comedy club",
  },
  {
    id: "4",
    title: "Artisan Farmers Market",
    description:
      "Shop for fresh, organic produce, handmade goods, and delicious treats directly from local farmers and artisans.",
    address: "Palace Grounds, Jayamahal Main Rd, Bengaluru, Karnataka 560006",
    date: formatISO(addHours(now, 24)),
    tags: ["Market", "Food", "Local"],
    imageUrl: "https://placehold.co/600x400.png",
    "data-ai-hint": "farmers market",
  },
];
