'use server';

import { TripParams, Itinerary } from '../types';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function generateTrip(params: TripParams): Promise<Itinerary> {
  console.log(`Generating AI trip for ${params.destination} with budget $${params.budget}`);

  const schema = z.object({
    days: z.array(z.object({
      day: z.number(),
      theme: z.string(),
      dailyTotal: z.number(),
      activities: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        estimatedCost: z.number(),
        duration: z.string(),
        type: z.enum(['food', 'adventure', 'culture', 'relaxation', 'sightseeing']),
        location: z.object({
          lat: z.number(),
          lng: z.number(),
        }).optional().describe("Coordinates for the activity. MUST be accurate real-world coordinates for the location."),
      }))
    })),
    totalCost: z.number()
  });

  try {
    const { object } = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: schema,
      prompt: `
        Plan a Detailed Trip to ${params.destination}.
        
        Constraints:
        - Duration: ${params.days} Days
        - Travelers: ${params.travelers} Persons
        - Total Budget: $${params.budget}
        - Interests: ${params.interests.join(', ')}
        
        Guidelines:
        - STRICTLY follow the JSON schema.
        - Do NOT include any markdown formatting (like \`\`\`json) in the response.
        - Ensure coordinates are numeric and valid.
        - If budget is tight, suggest cheaper activities.
      `,
    });

    return {
      id: Date.now().toString(),
      destination: params.destination,
      totalCost: object.totalCost,
      days: object.days
    };

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    // Return a meaningful error to the client
    const errorMessage = error?.message || "Unknown error occurred";
    throw new Error(`AI generation failed: ${errorMessage}`);
  }
}
