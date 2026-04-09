import { useState } from "react";
import { Volume2, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import useSpeech from "@/hooks/useSpeech";

const speedOptions = [
  { label: "🐢 Devagar", emoji: "🐢", value: 25, aria: "Velocidade lenta" },
  { label: "🚶 Normal",  emoji: "🚶", value: 50, aria: "Velocidade normal" },
  { label: "🏃 Rápido",  emoji: "🏃", value: 75, aria: "Velocidade rápida" },
];

const SettingsPage = () => {
  const [volume, setVolume] = useState(80);
  const [speed, setSpeed] = useState(50);

  useSpeech("Configurações.");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2 mb-6">
          <span aria-hidden="true">⚙️</span> Configurações
        </h1>

        <div className="space-y-4">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-card rounded-3xl p-5 shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary rounded-xl p-2">
                <Volume2 size={24} className="text-primary-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="font-black text-foreground">Volume</p>
                <p className="text-sm text-muted-foreground font-semibold">Volume do áudio: {volume}%</p>
              </div>
            </div>
            <label htmlFor="volume-range" className="sr-only">
              Volume do áudio: {volume}%
            </label>
            <input
              id="volume-range"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-valuenow={volume}
              aria-valuemin={0}
              aria-valuemax={100}
              className="w-full h-3 rounded-full appearance-none bg-muted
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-7
                [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-5 shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-accent rounded-xl p-2">
                <Gauge size={24} className="text-accent-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="font-black text-foreground">Velocidade de Leitura</p>
                <p className="text-sm text-muted-foreground font-semibold">
                  {speedOptions.find((s) => s.value === speed)?.label ?? "Normal"}
                </p>
              </div>
            </div>
            <div className="flex gap-2" role="group" aria-label="Escolha a velocidade de leitura">
              {speedOptions.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSpeed(s.value)}
                  aria-pressed={speed === s.value}
                  aria-label={s.aria}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all text-center ${
                    speed === s.value
                      ? "bg-accent shadow-md scale-105"
                      : "bg-muted"
                  }`}
                >
                  <span className="text-2xl block" aria-hidden="true">{s.emoji}</span>
                  <span className="text-xs font-bold text-foreground block mt-1">
                    {s.emoji === "🐢" ? "Devagar" : s.emoji === "🚶" ? "Normal" : "Rápido"}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-3xl p-5 shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl" role="img" aria-label="Bandeira do Brasil">🇧🇷</span>
              <div>
                <p className="font-black text-foreground">Idioma</p>
                <p className="text-sm text-muted-foreground font-semibold">Português do Brasil</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-3xl p-5 shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden="true">📱</span>
              <div>
                <p className="font-black text-foreground">ABC Aventura</p>
                <p className="text-sm text-muted-foreground font-semibold">Versão 1.0.0</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
