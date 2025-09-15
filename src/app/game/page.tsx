"use client";

import { useMemo, useState } from "react";
import GameCanvas from "./gameCanvas";
import { DEFAULT_LEVEL, LevelId, levels } from "./mapData";

export default function GamePage() {
  const defaultLevel = DEFAULT_LEVEL;
  const [selectedLevelId, setSelectedLevelId] = useState<LevelId>(
    defaultLevel.id
  );

  const activeLevel = useMemo(() => {
    const next = levels.find((lvl) => lvl.id === selectedLevelId);
    return next ?? defaultLevel;
  }, [selectedLevelId, defaultLevel]);

  return (
    <main className="overflow-x-hidden flex flex-col items-center gap-6 p-6">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Adventure Levels</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Use the arrow keys or WASD to explore the overworld. Select a level to
          instantly travel to a new area of the region.
        </p>
      </section>
      <div className="flex flex-wrap justify-center gap-3" role="tablist" aria-label="Level selector">
        {levels.map((levelOption) => {
          const isActive = levelOption.id === activeLevel.id;
          return (
            <button
              key={levelOption.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedLevelId(levelOption.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                isActive
                  ? "bg-blue-500 border-blue-500 text-white shadow"
                  : "bg-white/80 border-neutral-300 text-neutral-700 hover:border-blue-400 hover:text-blue-600 dark:bg-neutral-800/90 dark:text-neutral-200 dark:border-neutral-600"
              }`}
            >
              {levelOption.name}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-300 max-w-3xl text-center">
        {activeLevel.description}
      </p>
      <GameCanvas level={activeLevel} />
    </main>
  );
}
