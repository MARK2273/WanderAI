"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TripParams } from "@/lib/types";
import { MapPin, Calendar, DollarSign, Users, Heart } from "lucide-react";

interface TripFormProps {
  onSubmit: (data: TripParams) => void;
  isLoading: boolean;
}

export function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TripParams>({
    destination: "",
    budget: 1000,
    days: 3,
    travelers: 1,
    interests: [],
  });

  const INTERESTS = [
    "Food",
    "History",
    "Art",
    "Nature",
    "Nightlife",
    "Shopping",
  ];

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
      <div className="mb-8 flex justify-between items-center">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                step >= i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {i}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Where to?</h2>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <MapPin size={16} /> Destination
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="e.g., Paris, Tokyo"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Users size={16} /> Travelers
              </label>
              <input
                type="number"
                min={1}
                value={formData.travelers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    travelers: parseInt(e.target.value),
                  })
                }
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              onClick={nextStep}
              disabled={!formData.destination}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Details</h2>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <Calendar size={16} /> Duration (Days)
              </label>
              <input
                type="range"
                min={1}
                max={14}
                value={formData.days}
                onChange={(e) =>
                  setFormData({ ...formData, days: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-blue-400 font-mono">
                {formData.days} Days
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 flex items-center gap-2">
                <DollarSign size={16} /> Total Budget ($)
              </label>
              <input
                type="number"
                step={100}
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: parseInt(e.target.value) })
                }
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={prevStep}
                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Interests</h2>

            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? "bg-blue-600/20 border-blue-500 text-blue-300"
                      : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={prevStep}
                className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin text-xl">Creating...</span>
                ) : (
                  "Create Plan"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
