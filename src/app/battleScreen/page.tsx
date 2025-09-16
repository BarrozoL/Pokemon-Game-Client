"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { battleEncounters } from "../game/eventData";
import { DEFAULT_LEVEL } from "../game/mapData";

interface AttackDefinition {
  name: string;
  power: number;
  description?: string;
}

export default function BattleScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const encounterId = searchParams.get("encounter") ?? "";
  const returnLevel = searchParams.get("returnLevel") ?? DEFAULT_LEVEL.id;
  const encounter = useMemo(
    () => battleEncounters[encounterId],
    [encounterId]
  );

  const [playerHp, setPlayerHp] = useState(() =>
    encounter ? encounter.playerMaxHp : 0
  );
  const [enemyHp, setEnemyHp] = useState(() =>
    encounter ? encounter.enemyMaxHp : 0
  );
  const [battleState, setBattleState] = useState<
    "awaiting" | "ongoing" | "victory" | "defeat"
  >(encounter ? "ongoing" : "awaiting");
  const [log, setLog] = useState<string[]>(
    encounter ? [encounter.introText] : []
  );

  useEffect(() => {
    if (!encounter) {
      setBattleState("awaiting");
      setLog([]);
      setPlayerHp(0);
      setEnemyHp(0);
      return;
    }
    setPlayerHp(encounter.playerMaxHp);
    setEnemyHp(encounter.enemyMaxHp);
    setBattleState("ongoing");
    setLog([encounter.introText]);
  }, [encounter]);

  const handleAttack = useCallback(
    (attack: AttackDefinition) => {
      if (!encounter || battleState !== "ongoing") {
        return;
      }

      const updates: string[] = [];
      updates.push(
        `Você usou ${attack.name}!${
          attack.description ? ` ${attack.description}` : ""
        }`
      );

      const nextEnemyHp = Math.max(0, enemyHp - attack.power);
      let nextPlayerHp = playerHp;

      if (nextEnemyHp <= 0) {
        updates.push(`${encounter.enemyName} foi derrotado!`);
        updates.push(encounter.victoryText);
        setEnemyHp(nextEnemyHp);
        setBattleState("victory");
        setLog((prev) => [...prev, ...updates]);
        return;
      }

      const enemyAttack =
        encounter.enemyAttacks[
          Math.floor(Math.random() * encounter.enemyAttacks.length)
        ];
      updates.push(
        `${encounter.enemyName} usou ${enemyAttack.name}!${
          enemyAttack.description ? ` ${enemyAttack.description}` : ""
        }`
      );
      nextPlayerHp = Math.max(0, playerHp - enemyAttack.power);

      if (nextPlayerHp <= 0) {
        updates.push(encounter.defeatText);
        setBattleState("defeat");
      }

      setEnemyHp(nextEnemyHp);
      setPlayerHp(nextPlayerHp);
      setLog((prev) => [...prev, ...updates]);
    },
    [battleState, encounter, enemyHp, playerHp]
  );

  const goBackToMap = useCallback(() => {
    router.push(`/game?level=${returnLevel}`);
  }, [returnLevel, router]);

  const playerHpPercent = encounter
    ? Math.max(0, Math.round((playerHp / encounter.playerMaxHp) * 100))
    : 0;
  const enemyHpPercent = encounter
    ? Math.max(0, Math.round((enemyHp / encounter.enemyMaxHp) * 100))
    : 0;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl backdrop-blur">
        {encounter ? (
          <>
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Batalha contra {encounter.enemyName}</h1>
                <p className="text-sm text-neutral-300">
                  Escolha um ataque para vencer o duelo por turnos.
                </p>
              </div>
              <button
                type="button"
                onClick={goBackToMap}
                className="rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
              >
                Fugir da batalha
              </button>
            </header>

            <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="rounded-lg border border-neutral-800 bg-neutral-900/90 p-4">
                <h2 className="text-lg font-semibold">Você</h2>
                <div className="mt-2 h-2 w-full rounded-full bg-neutral-800">
                  <div
                    className="h-2 rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${playerHpPercent}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-neutral-300">
                  HP: {playerHp} / {encounter.playerMaxHp}
                </p>
                <div className="mt-4 flex justify-center">
                  <Image
                    src="/characters/player-front.png"
                    alt="Sprite do jogador"
                    width={128}
                    height={128}
                    className="h-32 w-32 object-contain"
                    priority
                  />
                </div>
              </article>

              <article className="rounded-lg border border-neutral-800 bg-neutral-900/90 p-4 text-right">
                <h2 className="text-lg font-semibold">{encounter.enemyName}</h2>
                <div className="mt-2 h-2 w-full rounded-full bg-neutral-800">
                  <div
                    className="h-2 rounded-full bg-rose-400 transition-all"
                    style={{ width: `${enemyHpPercent}%` }}
                  />
                </div>
                <p className="mt-1 text-sm text-neutral-300">
                  HP: {enemyHp} / {encounter.enemyMaxHp}
                </p>
                <div className="mt-4 flex justify-center">
                  <Image
                    src={encounter.enemySprite}
                    alt={`Sprite de ${encounter.enemyName}`}
                    width={128}
                    height={128}
                    className="h-32 w-32 object-contain"
                  />
                </div>
              </article>
            </section>

            <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {encounter.playerAttacks.map((attack) => (
                <button
                  key={attack.name}
                  type="button"
                  onClick={() => handleAttack(attack)}
                  disabled={battleState !== "ongoing"}
                  className="rounded-lg border border-emerald-500 bg-emerald-600/20 px-4 py-3 text-left text-sm font-semibold text-emerald-200 shadow transition hover:bg-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:border-neutral-700 disabled:text-neutral-500 disabled:hover:bg-transparent"
                >
                  <span className="block text-base">{attack.name}</span>
                  {attack.description && (
                    <span className="mt-1 block text-xs font-normal text-emerald-100/80">
                      {attack.description}
                    </span>
                  )}
                </button>
              ))}
            </section>

            <section className="mt-6 h-48 overflow-y-auto rounded-lg border border-neutral-800 bg-neutral-900/90 p-4 text-sm leading-relaxed">
              {log.map((line, index) => (
                <p key={`${line}-${index}`} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </section>

            {battleState !== "ongoing" && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={goBackToMap}
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
                >
                  Retornar ao mapa
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold">Nenhuma batalha ativa</h2>
            <p className="text-sm text-neutral-300">
              Volte ao mapa e converse com um desafiante para iniciar um duelo.
            </p>
            <button
              type="button"
              onClick={goBackToMap}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
            >
              Voltar ao mapa
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
