"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Sparkles, Loader2 } from 'lucide-react';
import type { Token } from '@/lib/types';
import { getSuggestions } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  itemName: z.string().min(2, 'Item name must be at least 2 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
});

type TokenFormProps = {
  addToken: (token: Omit<Token, 'id' | 'status' | 'createdAt'>) => void;
};

export default function TokenForm({ addToken }: TokenFormProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
      price: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addToken(values);
    form.reset();
    setSuggestions([]);
  }

  const handleSuggest = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const suggestedItems = await getSuggestions();
      setSuggestions(suggestedItems);
      if (suggestedItems.length === 0) {
        toast({
          title: "Couldn't fetch suggestions",
          description: "The AI is thinking... maybe try again in a moment.",
          variant: "destructive",
        });
      }
    } catch (error) {
       toast({
          title: "Error fetching suggestions",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const selectSuggestion = (item: string) => {
    form.setValue('itemName', item);
    setSuggestions([]);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Token</CardTitle>
        <CardDescription>Fill in the details to generate a new food token.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Veg Biryani" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 90" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {(isSuggesting || suggestions.length > 0) && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">AI Suggestions:</p>
                {isSuggesting ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating ideas...</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <Button
                        key={item}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectSuggestion(item)}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="flex-grow">
                <PlusCircle className="mr-2 h-4 w-4" /> Generate Token
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSuggest}
                disabled={isSuggesting}
                className="flex-grow"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isSuggesting ? 'Thinking...' : 'AI Suggest Items'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
