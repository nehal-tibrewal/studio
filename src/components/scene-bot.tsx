"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { suggestActivities, type SuggestActivitiesOutput } from "@/ai/flows/suggest-activities";
import { generateEventImage } from "@/ai/flows/generate-event-image";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Wand2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  interest: z.string().min(3, {
    message: "Please enter a valid interest.",
  }),
});

type FormValues = z.infer<typeof formSchema>;
type Suggestion = SuggestActivitiesOutput['suggestions'][0];
type SuggestionWithImage = Suggestion & { imageUrl?: string };

export function SceneBot() {
  const [suggestions, setSuggestions] = useState<SuggestionWithImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interest: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await suggestActivities({ interest: values.interest });
      if (result.suggestions) {
        // Set initial suggestions so user sees text results first
        setSuggestions(result.suggestions);

        // Generate images for each suggestion
        const imagePromises = result.suggestions.map((suggestion) =>
          generateEventImage({
            title: suggestion.title,
            description: suggestion.description,
          }).catch((err) => {
            console.error("Image generation failed for:", suggestion.title, err);
            return { imageUrl: null }; // Handle failure for a single image
          })
        );

        const imageResults = await Promise.all(imagePromises);

        // Update suggestions with the new images
        setSuggestions((currentSuggestions) =>
          currentSuggestions.map((suggestion, index) => ({
            ...suggestion,
            imageUrl: imageResults[index]?.imageUrl || undefined,
          }))
        );
      }
    } catch (e) {
      setError("Sorry, the AI is taking a break. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center text-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wand2 className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-3xl">Your Personal Event Scout</CardTitle>
            <CardDescription>
              We’ll help you find the vibe. Just tell us what you're looking for.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter an interest</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'live music' or 'food festivals'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Thinking..." : "Get Recommendations"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {error && <p className="mt-4 text-destructive">{error}</p>}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-8 w-full max-w-lg mx-auto text-left">
           <Separator className="my-8" />
          <h3 className="font-headline text-2xl font-bold mb-4 text-center">Here's what I found:</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="overflow-hidden">
                {suggestion.imageUrl ? (
                    <div className="relative aspect-video w-full">
                      <Image
                        src={suggestion.imageUrl}
                        alt={suggestion.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full animate-pulse bg-muted" />
                  )}
                <CardHeader>
                  <CardTitle>{suggestion.title}</CardTitle>
                   <CardDescription className="flex items-center gap-2 pt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{suggestion.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90 mb-4">{suggestion.description}</p>
                  <Badge variant="secondary">{suggestion.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
