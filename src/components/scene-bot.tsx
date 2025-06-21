"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { suggestActivities } from "@/ai/flows/suggest-activities";
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
import { Wand2, Zap } from "lucide-react";

const formSchema = z.object({
  userLocation: z.string().min(3, {
    message: "Please enter a valid location.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function SceneBot() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userLocation: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const result = await suggestActivities(values);
      if (result.suggestions) {
        setSuggestions(result.suggestions);
      }
    } catch (e) {
      setError("Sorry, the AI is taking a break. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wand2 className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl">Nothing on the Radar?</CardTitle>
          <CardDescription>
            It's quiet out there. Let SceneBot suggest some cool spots for you.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="userLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter your location or neighborhood</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Koramangala, Bangalore" {...field} />
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

      {suggestions.length > 0 && (
        <div className="mt-8 w-full max-w-lg text-left">
          <h3 className="font-headline text-2xl font-bold">Here's what I found:</h3>
          <ul className="mt-4 space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3 rounded-lg border bg-card p-4">
                <Zap className="h-5 w-5 flex-shrink-0 text-primary" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
