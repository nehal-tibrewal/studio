"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { suggestActivities, type SuggestActivitiesOutput } from "@/ai/flows/suggest-activities";
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
import { Wand2, Zap, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  interest: z.string().min(3, {
    message: "Please enter a valid interest.",
  }),
});

type FormValues = z.infer<typeof formSchema>;
type Suggestion = SuggestActivitiesOutput['suggestions'][0];

export function SceneBot() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <Zap className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                    <span>{suggestion.title}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pl-8 -mt-2">
                      <MapPin className="h-4 w-4" />
                      <span>{suggestion.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="pl-8">
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
