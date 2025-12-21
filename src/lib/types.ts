export interface TripParams {
  destination: string;
  budget: number;
  days: number;
  travelers: number;
  interests: string[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  estimatedCost: number;
  duration: string; // e.g., "2 hours"
  type: "food" | "adventure" | "culture" | "relaxation" | "sightseeing";
  location?: {
    lat: number;
    lng: number;
  };
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
  dailyTotal: number;
}

export interface Itinerary {
  id: string;
  destination?: string;
  totalCost: number;
  days: DayPlan[];
}
