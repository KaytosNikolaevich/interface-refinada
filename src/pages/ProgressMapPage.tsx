import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import useSpeech from "@/hooks/useSpeech";

interface MapNode {
  id: string;
  label: string;
  emoji: string;
  completed: boolean;
  current: boolean;
  x: number;
  y: number;
}

const mapNodes: MapNode[] = [
  { id: "1", label: "Início",    emoji: "🔤", completed: true,  current: false, x: 50, y: 90 },
  { id: "2", label: "Letra A",   emoji: "🅰️", completed: true,  current: false, x: 30, y: 75 },
  { id: "3", label: "Letra B",   emoji: "🅱️", completed: false, current: true,  x: 65, y: 62 },
  { id: "4", label: "Sílabas",   emoji: "📝", completed: false, current: false, x: 40, y: 48 },
  { id: "5", label: "Palavras",  emoji: "📝", completed: false, current: false, x: 60, y: 35 },
  { id: "6", label: "Leitura",   emoji: "📖", completed: false, current: false, x: 35, y: 22 },
  { id: "7", label: "Frases",    emoji: "💬", completed: false, current: false, x: 55, y: 10 },
  { id: "8", label: "Mestre",    emoji: "🏆", completed: false, current: false, x: 50, y: 0  },
];

const ProgressMapPage = () => {
  const navigate = useNavigate();
  useSpeech("Mapa do seu progresso. Você está indo muito bem!");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-8 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/progress")}
          className="p-2 rounded-xl bg-card shadow"
          aria-label="Voltar ao progresso"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <span aria-hidden="true">🗺️</span> Mapa da Jornada
        </h1>
      </header>

      <div
        className="relative mx-6"
        style={{ height: "70vh" }}
        role="img"
        aria-label="Mapa de progresso com 8 etapas de aprendizagem"
      >
        {mapNodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`absolute flex flex-col items-center gap-1 ${
              node.completed
                ? "opacity-100"
                : node.current
                ? "opacity-100"
                : "opacity-40"
            }`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            title={`${node.label}${node.completed ? " — Concluído" : node.current ? " — Em andamento" : " — Bloqueado"}`}
          >
            <div
              className={`w-16 h-16 rounded-full shadow-lg text-3xl flex items-center justify-center ${
                node.completed
                  ? "bg-primary"
                  : node.current
                  ? "bg-secondary animate-pulse-glow"
                  : "bg-muted"
              }`}
              aria-hidden="true"
            >
              {node.emoji}
            </div>
            <span className="text-xs font-bold text-foreground text-center leading-tight max-w-[60px]">
              {node.label}
            </span>
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default ProgressMapPage;
