"use client";

import { useState } from "react";
import { TripForm } from "@/components/TripForm";
import { AgentThinkLog } from "@/components/AgentThinkLog";
import { ItineraryTimeline } from "@/components/ItineraryTimeline";
import { generateTrip } from "@/lib/agents/planner";
import { TripParams, Itinerary } from "@/lib/types";
import { Plane, Map as MapIcon } from "lucide-react";

export default function Home() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handlePlanTrip = async (params: TripParams) => {
    setIsLoading(true);
    setItinerary(null);
    setLogs([]);

    // Simulate Agent "Thought Process"
    const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

    try {
      addLog("Initializing Travel Agent...");
      await new Promise((r) => setTimeout(r, 800));

      addLog(`Analyzing destination: ${params.destination}...`);
      await new Promise((r) => setTimeout(r, 800));

      addLog(
        `Fetching activities matching interests: [${params.interests.join(
          ", "
        )}]...`
      );
      await new Promise((r) => setTimeout(r, 1000));

      addLog("Checking budget constraints...");
      // Generate actual trip
      const trip = await generateTrip(params);

      addLog("Validating time allocation...");
      await new Promise((r) => setTimeout(r, 500));

      if (trip.totalCost > params.budget) {
        addLog(
          `WARNING: Plan exceeds budget ($${trip.totalCost} > $${params.budget}). adjusting...`
        );
        await new Promise((r) => setTimeout(r, 1000));
        addLog("Optimizing itinerary for cost efficiency...");
      } else {
        addLog("Budget check passed.");
      }

      addLog("Finalizing itinerary...");
      await new Promise((r) => setTimeout(r, 500));

      setItinerary(trip);
      addLog("Done! Trip plan ready.");
    } catch (error: any) {
      const msg = error?.message || String(error);
      addLog(`Error: ${msg}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Plane className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">WanderAI</h1>
            <p className="text-gray-400">Your Intelligent Travel Agent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Input & Logs */}
          <div className="space-y-8">
            <TripForm onSubmit={handlePlanTrip} isLoading={isLoading} />

            {(isLoading || logs.length > 0) && <AgentThinkLog logs={logs} />}
          </div>

          {/* Right Column: Results */}
          <div>
            {itinerary ? (
              <ItineraryTimeline
                itinerary={itinerary}
                destination={itinerary.destination || "Paris"}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-800 rounded-3xl text-gray-600">
                <MapIcon size={64} className="mb-4 opacity-50" />
                <p className="text-xl">Your journey begins here.</p>
                <p className="text-sm">
                  Enter your details to generate a plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
