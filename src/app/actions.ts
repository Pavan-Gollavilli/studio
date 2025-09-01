'use server';

import { suggestPopularMenuItems } from '@/ai/flows/suggest-popular-menu-items';

function getTimeOfDay(date: Date): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return 'morning';
  }
  if (hour >= 12 && hour < 17) {
    return 'afternoon';
  }
  return 'evening';
}

function getDayOfWeek(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export async function getSuggestions(): Promise<string[]> {
  try {
    const now = new Date();
    const timeOfDay = getTimeOfDay(now);
    const dayOfWeek = getDayOfWeek(now);

    const result = await suggestPopularMenuItems({ timeOfDay, dayOfWeek });
    return result.suggestedItems || [];
  } catch (error) {
    console.error('Error fetching AI suggestions:', error);
    return ['Pizza', 'Burger', 'Salad', 'Pasta'];
  }
}
