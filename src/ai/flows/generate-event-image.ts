'use server';
/**
 * @fileOverview AI flow to generate an image for an event.
 *
 * - generateEventImage - A function that generates an image for an event.
 * - GenerateEventImageInput - The input type for the generateEventImage function.
 * - GenerateEventImageOutput - The return type for the generateEventImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventImageInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  description: z.string().describe('A short description of the event.'),
});
export type GenerateEventImageInput = z.infer<typeof GenerateEventImageInputSchema>;

const GenerateEventImageOutputSchema = z.object({
  imageUrl: z.string().describe("The data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateEventImageOutput = z.infer<typeof GenerateEventImageOutputSchema>;

export async function generateEventImage(input: GenerateEventImageInput): Promise<GenerateEventImageOutput> {
  return generateEventImageFlow(input);
}

const generateEventImageFlow = ai.defineFlow(
  {
    name: 'generateEventImageFlow',
    inputSchema: GenerateEventImageInputSchema,
    outputSchema: GenerateEventImageOutputSchema,
  },
  async ({title, description}) => {
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate an event poster for an event titled "${title}". The event is about: ${description}. The style should be modern, vibrant, and suitable for an event listing website. Avoid putting any text on the image. Focus on a central, compelling visual.`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    if (!media.url) {
      throw new Error('Image generation failed.');
    }
    
    return {
      imageUrl: media.url,
    };
  }
);
