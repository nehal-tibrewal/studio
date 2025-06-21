// src/ai/flows/suggest-activities.ts
'use server';

/**
 * @fileOverview AI flow to suggest local spots or activities.
 *
 * - suggestActivities - A function that suggests local activities.
 * - SuggestActivitiesInput - The input type for the suggestActivities function.
 * - SuggestActivitiesOutput - The return type for the suggestActivities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActivitiesInputSchema = z.object({
  interest: z.string().describe('The user interest, like "live music" or "tech workshops".'),
});

export type SuggestActivitiesInput = z.infer<typeof SuggestActivitiesInputSchema>;

const SuggestedEventSchema = z.object({
  title: z.string().describe('The creative and catchy title of the event.'),
  description: z
    .string()
    .describe('A compelling, short description of the event (2-3 sentences).'),
  category: z
    .string()
    .describe('A single, relevant category for the event (e.g., Music, Tech, Art, Food, Workshop).'),
  location: z
    .string()
    .describe('A plausible, fictional, or real-sounding location for the event in Bangalore.'),
});

const SuggestActivitiesOutputSchema = z.object({
  suggestions: z.array(SuggestedEventSchema).describe('A list of 3-5 suggested events.'),
});

export type SuggestActivitiesOutput = z.infer<typeof SuggestActivitiesOutputSchema>;

export async function suggestActivities(input: SuggestActivitiesInput): Promise<SuggestActivitiesOutput> {
  return suggestActivitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActivitiesPrompt',
  input: {schema: SuggestActivitiesInputSchema},
  output: {schema: SuggestActivitiesOutputSchema},
  prompt: `You are SceneBLR, an expert event scout for Bangalore. You find the coolest, most interesting events happening in the city, similar to what one might find on Luma, BookMyShow, or Insider.

A user is looking for events related to their interest: '{{{interest}}}'

Generate a list of 3 to 5 creative and realistic-sounding event suggestions in Bangalore based on their interest.

For each suggestion, provide a unique title, a compelling description, a relevant category, and a plausible-sounding location in Bangalore.`,
});

const suggestActivitiesFlow = ai.defineFlow(
  {
    name: 'suggestActivitiesFlow',
    inputSchema: SuggestActivitiesInputSchema,
    outputSchema: SuggestActivitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
