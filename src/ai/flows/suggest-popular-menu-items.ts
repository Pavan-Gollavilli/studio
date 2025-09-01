'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting popular menu items based on the current time of day or day of the week.
 *
 * - suggestPopularMenuItems - A function that suggests popular menu items.
 * - SuggestPopularMenuItemsInput - The input type for the suggestPopularMenuItems function.
 * - SuggestPopularMenuItemsOutput - The return type for the suggestPopularMenuItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPopularMenuItemsInputSchema = z.object({
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening).'),
  dayOfWeek: z.string().describe('The current day of the week (e.g., Monday, Tuesday).'),
});
export type SuggestPopularMenuItemsInput = z.infer<typeof SuggestPopularMenuItemsInputSchema>;

const SuggestPopularMenuItemsOutputSchema = z.object({
  suggestedItems: z.array(z.string()).describe('A list of suggested popular menu items.'),
});
export type SuggestPopularMenuItemsOutput = z.infer<typeof SuggestPopularMenuItemsOutputSchema>;

export async function suggestPopularMenuItems(input: SuggestPopularMenuItemsInput): Promise<SuggestPopularMenuItemsOutput> {
  return suggestPopularMenuItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPopularMenuItemsPrompt',
  input: {schema: SuggestPopularMenuItemsInputSchema},
  output: {schema: SuggestPopularMenuItemsOutputSchema},
  prompt: `You are a canteen manager providing suggestions for popular menu items based on the time of day and day of the week.

  Suggest menu items that are likely to be popular given the following information:

  Time of Day: {{{timeOfDay}}}
  Day of Week: {{{dayOfWeek}}}

  Return a JSON array of suggested menu items. Consider breakfast, lunch and dinner items. Give four suggestions.
  `,
});

const suggestPopularMenuItemsFlow = ai.defineFlow(
  {
    name: 'suggestPopularMenuItemsFlow',
    inputSchema: SuggestPopularMenuItemsInputSchema,
    outputSchema: SuggestPopularMenuItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
