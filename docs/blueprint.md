# **App Name**: SceneBLR

## Core Features:

- Event Feed: Display a scrollable list of upcoming events, each with a title, time, tags, preview image, and location.
- Event Detail Page: Display a detailed view of each event, including a description, start and end times, and an embedded Google Maps iframe based on the stored address.
- Submit Event Page: Allow logged-in users to submit new events with a title, description, tags, address, date, time, and optional image upload. Events are saved to Firestore with a timestamp and user ID.
- SceneBot AI Recommendations: If no events are available in the next 3 hours, use an AI tool to generate suggestions for local spots or activities.
- Authentication: Implement Google Sign-In for user authentication. Only authenticated users can submit events.

## Style Guidelines:

- Primary color: #BAD8B6 to create a calming and inviting atmosphere.
- Secondary color: #E1EACD, used for backgrounds to provide a soft contrast.
- Accent color: #F9F6E6, used for text and icons to ensure readability and clarity.
- Highlight color: #8D77AB, used for interactive elements and CTAs to draw attention.
- Headings font: ‘Space Grotesk’ (sans-serif) for headings.
- Body text font: ‘Inter’ (sans-serif) for body text.
- Implement a mobile-first, single-column layout for a streamlined and responsive user experience.
- Employ subtle animations for page transitions and card displays to enhance user engagement without overwhelming the user.