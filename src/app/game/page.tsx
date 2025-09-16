"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GameCanvas from "./gameCanvas";
import { DEFAULT_LEVEL, LevelId, levels } from "./mapData";
import type { DialogueEntry } from "./eventData";

interface LevelState {
  id: LevelId;
  entry: { row: number; col: number };
}

export default function GamePage() {
  const defaultLevel = DEFAULT_LEVEL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogue, setDialogue] = useState<DialogueEntry | null>(null);
  const [levelState, setLevelState] = useState<LevelState>(() => ({
    id: defaultLevel.id as LevelId,
    entry: { ...defaultLevel.startingPosition },
  }));

  const activeLevel = useMemo(() => {
    const next = levels.find((lvl) => lvl.id === levelState.id);
    return next ?? defaultLevel;
  }, [levelState.id, defaultLevel]);

  const handleSelectLevel = useCallback(
    (levelId: LevelId) => {
      const targetLevel = levels.find((lvl) => lvl.id === levelId);
      if (!targetLevel) {
        return;
      }
      setDialogue(null);
      setLevelState({
        id: targetLevel.id as LevelId,
        entry: { ...targetLevel.startingPosition },
      });
    },
    []
  );

  const handleLevelTransition = useCallback(
    (transition: { targetLevelId: string; spawn?: { row: number; col: number } }) => {
      const target = levels.find((lvl) => lvl.id === transition.targetLevelId);
      if (!target) {
        return;
      }
      setDialogue(null);
      setLevelState({
        id: target.id as LevelId,
        entry: transition.spawn
          ? { ...transition.spawn }
          : { ...target.startingPosition },
      });
    },
    []
  );

  const openDialogue = useCallback((entry: DialogueEntry) => {
    setDialogue(entry);
  }, []);

  const levelFromParams = searchParams.get("level");
  useEffect(() => {
    if (!levelFromParams || levelFromParams === levelState.id) {
      return;
    }
    const match = levels.find((lvl) => lvl.id === levelFromParams);
    if (match) {
      setLevelState({
        id: match.id as LevelId,
        entry: { ...match.startingPosition },
      });
    }
  }, [levelFromParams, levelState.id]);

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("level", levelState.id);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams, levelState.id]);

  useEffect(() => {
    if (!dialogue) {
      return;
    }
    function handleClose(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter") {
        setDialogue(null);
      }
    }
    window.addEventListener("keydown", handleClose);
    return () => window.removeEventListener("keydown", handleClose);
  }, [dialogue]);

  return (
    <main className="overflow-x-hidden flex flex-col items-center gap-6 p-6">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Adventure Levels</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          Use the arrow keys or WASD to explore, then press Enter or Space to
          speak with NPCs or activate waystones. Select a level to instantly
          travel, or walk through the world to discover each biome in sequence.
        </p>
      </section>
      <div
        className="flex flex-wrap justify-center gap-3"
        role="tablist"
        aria-label="Level selector"
      >
        {levels.map((levelOption) => {
          const isActive = levelOption.id === activeLevel.id;
          return (
            <button
              key={levelOption.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectLevel(levelOption.id as LevelId)}
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
      <GameCanvas
        level={activeLevel}
        entryPosition={levelState.entry}
        onLevelChange={handleLevelTransition}
        onDialogue={openDialogue}
        isInputDisabled={Boolean(dialogue)}
      />
      {dialogue && (
        <div className="fixed inset-0 z-10 flex items-end justify-center bg-black/40 px-4 pb-8">
          <div className="w-full max-w-2xl rounded-lg border border-neutral-700 bg-neutral-900/90 p-6 text-neutral-100 shadow-2xl">
            <h2 className="text-lg font-semibold">{dialogue.name}</h2>
            <div className="mt-3 space-y-2 text-sm leading-relaxed">
              {dialogue.lines.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDialogue(null)}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
