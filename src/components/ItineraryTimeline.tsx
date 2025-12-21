"use client";

import { Itinerary, DayPlan, Activity } from "@/lib/types";
import { motion } from "framer-motion";
import { Clock, DollarSign, MapPin } from "lucide-react";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-xl bg-gray-800 animate-pulse flex items-center justify-center">
      Loading Map...
    </div>
  ),
});

interface ItineraryTimelineProps {
  itinerary: Itinerary;
  destination?: string;
}

export function ItineraryTimeline({
  itinerary,
  destination,
}: ItineraryTimelineProps) {
  // Flatten all activities for the map
  const allActivities = itinerary.days.flatMap((d) => d.activities);

  return (
    <div className="w-full space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Trip Itinerary
        </h2>
        <p className="text-gray-400">
          Total Estimated Cost:{" "}
          <span className="text-green-400 font-mono">
            ${itinerary.totalCost}
          </span>
        </p>
      </div>

      <MapComponent activities={allActivities} destination={destination} />

      <div className="space-y-12">
        {itinerary.days.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
            className="relative pl-8 border-l-2 border-gray-700 ml-4"
          >
            {/* Day Header */}
            <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-blue-900 border-4 border-gray-900 flex items-center justify-center text-blue-300 font-bold">
              {day.day}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">
                Day {day.day}: {day.theme}
              </h3>
              <p className="text-sm text-gray-500">
                Estimated Day Cost: ${day.dailyTotal}
              </p>
            </div>

            {/* Activities */}
            <div className="space-y-4">
              {day.activities.map((activity, actIndex) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  index={actIndex}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-blue-200">{activity.name}</h4>
        <span className="text-xs px-2 py-1 rounded bg-blue-900/30 text-blue-300 uppercase tracking-wider">
          {activity.type}
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-3">{activity.description}</p>

      <div className="flex gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={12} /> {activity.duration}
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={12} /> ${activity.estimatedCost}
        </div>
      </div>
    </motion.div>
  );
}
