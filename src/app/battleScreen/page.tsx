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

      let nextEnemyHp, nextPlayerHp = playerHp;

      if (attack.power < 0) {
        // Healing attack - heals the player
        nextPlayerHp = Math.min(encounter.playerMaxHp, playerHp - attack.power);
        nextEnemyHp = enemyHp;
        updates.push(`Você se curou em ${Math.abs(attack.power)} pontos de vida!`);
      } else {
        // Damage attack - damages the enemy
        nextEnemyHp = Math.max(0, enemyHp - attack.power);
        updates.push(`Causou ${attack.power} de dano em ${encounter.enemyName}!`);
      }

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

      if (enemyAttack.power < 0) {
        // Enemy healing attack - heals the enemy
        setEnemyHp(prev => Math.min(encounter.enemyMaxHp, prev - enemyAttack.power));
        updates.push(`${encounter.enemyName} se curou em ${Math.abs(enemyAttack.power)} pontos de vida!`);
      } else {
        // Enemy damage attack - damages the player
        nextPlayerHp = Math.max(0, nextPlayerHp - enemyAttack.power);
        updates.push(`${encounter.enemyName} causou ${enemyAttack.power} de dano em você!`);
      }

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
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-950 text-neutral-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Battle Arena */}
        <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-neutral-900/95 to-neutral-800/95 p-8 shadow-2xl backdrop-blur-md">
          {encounter ? (
            <>
              <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Batalha Épica
                  </h1>
                  <p className="text-lg text-neutral-300 mt-2">
                    Contra {encounter.enemyName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={goBackToMap}
                  className="group relative rounded-lg border-2 border-red-500/50 bg-red-600/20 px-6 py-3 text-sm font-semibold text-red-300 transition-all duration-300 hover:border-red-400 hover:bg-red-500/30 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <span className="relative z-10">⚡ Fugir da Batalha</span>
                  <div className="absolute inset-0 rounded-lg bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </header>

            {/* Battle Arena - Character Cards */}
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-8">
              {/* Player Card */}
              <article className="group relative rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-900/40 to-green-800/40 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/70 hover:shadow-2xl hover:shadow-emerald-500/20">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
                    🛡️ Herói
                  </h2>

                  {/* Health Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-200">Vida</span>
                      <span className="text-emerald-300 font-bold">{playerHp} / {encounter.playerMaxHp}</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-neutral-700/50 border border-emerald-500/30 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500 ease-out rounded-full shadow-lg"
                        style={{ width: `${playerHpPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-lg animate-pulse" />
                      <Image
                        src="/characters/player-front.png"
                        alt="Herói"
                        width={120}
                        height={120}
                        className="relative z-10 h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-110"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </article>

              {/* Enemy Card */}
              <article className="group relative rounded-2xl border-2 border-rose-500/50 bg-gradient-to-br from-rose-900/40 to-red-800/40 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-rose-400/70 hover:shadow-2xl hover:shadow-rose-500/20">
                <div className="absolute inset-0 rounded-2xl bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 text-right">
                  <h2 className="text-2xl font-bold text-rose-300 mb-4 flex items-center justify-end gap-2">
                    ⚔️ {encounter.enemyName}
                  </h2>

                  {/* Health Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-rose-300 font-bold">{enemyHp} / {encounter.enemyMaxHp}</span>
                      <span className="text-rose-200">Vida</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-neutral-700/50 border border-rose-500/30 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-red-400 transition-all duration-500 ease-out rounded-full shadow-lg"
                        style={{ width: `${enemyHpPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-rose-400/20 blur-lg animate-pulse" />
                      <Image
                        src={encounter.enemySprite}
                        alt={encounter.enemyName}
                        width={120}
                        height={120}
                        className="relative z-10 h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </article>
            </section>

            {/* Attack Buttons */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-center mb-6 text-amber-300">⚔️ Escolha seu Ataque</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {encounter.playerAttacks.map((attack, index) => {
                  const isHealing = attack.power < 0;
                  const isDamage = attack.power > 0;
                  const powerDisplay = Math.abs(attack.power);

                  return (
                    <button
                      key={attack.name}
                      type="button"
                      onClick={() => handleAttack(attack)}
                      disabled={battleState !== "ongoing"}
                      className={`group relative rounded-xl border-2 p-4 text-left transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${
                        isHealing
                          ? "border-green-500/50 bg-green-600/20 text-green-200 hover:border-green-400 hover:bg-green-500/30 focus-visible:ring-green-400"
                          : isDamage
                          ? "border-orange-500/50 bg-orange-600/20 text-orange-200 hover:border-orange-400 hover:bg-orange-500/30 focus-visible:ring-orange-400"
                          : "border-blue-500/50 bg-blue-600/20 text-blue-200 hover:border-blue-400 hover:bg-blue-500/30 focus-visible:ring-blue-400"
                      }`}
                    >
                      <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-base">
                            {isHealing ? "🌿" : isDamage ? "⚡" : "🔮"} {attack.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                            isHealing ? "bg-green-500/30 text-green-300" :
                            isDamage ? "bg-orange-500/30 text-orange-300" :
                            "bg-blue-500/30 text-blue-300"
                          }`}>
                            {isHealing ? `+${powerDisplay}` : isDamage ? powerDisplay : "?"}
                          </span>
                        </div>

                        {attack.description && (
                          <p className="text-xs opacity-80 leading-relaxed">
                            {attack.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Battle Log */}
            <section className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-yellow-900/20 backdrop-blur-sm">
              <div className="border-b border-amber-500/30 px-6 py-4">
                <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                  📜 Registro da Batalha
                </h3>
              </div>
              <div className="h-64 overflow-y-auto p-6 text-sm leading-relaxed space-y-3">
                {log.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className={`p-3 rounded-lg border-l-4 ${
                      line.includes("usou") || line.includes("Você")
                        ? "border-blue-400 bg-blue-900/20 text-blue-100"
                        : line.includes("dano") || line.includes("Causou")
                        ? "border-red-400 bg-red-900/20 text-red-100"
                        : line.includes("curou") || line.includes("se curou")
                        ? "border-green-400 bg-green-900/20 text-green-100"
                        : line.includes("derrotado") || line.includes("vitória")
                        ? "border-yellow-400 bg-yellow-900/20 text-yellow-100"
                        : "border-gray-400 bg-gray-900/20 text-gray-100"
                    } transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {line}
                  </div>
                ))}
                {log.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    A batalha está prestes a começar...
                  </div>
                )}
              </div>
            </section>

            {/* Battle End Buttons */}
            {battleState !== "ongoing" && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={goBackToMap}
                  className="group relative rounded-xl border-2 border-blue-500/50 bg-blue-600/20 px-8 py-4 text-lg font-semibold text-blue-300 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500/30 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    🗺️ Retornar ao Mapa
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            )}
            </>
          ) : (
            /* No Battle State */
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                Nenhuma Batalha Ativa
              </h2>
              <p className="text-lg text-neutral-300 max-w-md mx-auto">
                Explore o mundo e encontre NPCs desafiantes para iniciar combates épicos!
              </p>
              <button
                type="button"
                onClick={goBackToMap}
                className="group relative rounded-xl border-2 border-emerald-500/50 bg-emerald-600/20 px-8 py-4 text-lg font-semibold text-emerald-300 transition-all duration-300 hover:border-emerald-400 hover:bg-emerald-500/30 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🏠 Voltar à Aventura
                </span>
                <div className="absolute inset-0 rounded-xl bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
