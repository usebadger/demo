"use client";

import Aggregations from "@/components/badges/Aggregations";
import Events from "@/components/badges/Events";
import LevelUp from "@/components/badges/LevelUp";
import Milestones from "@/components/badges/Milestones";
import SkillTree from "@/components/badges/SkillTree";
import Streaks from "@/components/badges/Streaks";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Badger Demo</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {
              "This is a demo app for Badger, showcasing a few of Badger's features and usecases..."
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Events />
          <Milestones />
          <Streaks />
          <Aggregations />
          <div className="md:col-span-2">
            <SkillTree />
          </div>
          <LevelUp />
        </div>
      </main>
    </div>
  );
}
