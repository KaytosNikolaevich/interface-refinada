import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { achievements } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import useSpeech from "@/hooks/useSpeech";

const weeklyData = [
  { day: "Seg", score: 3 },
  { day: "Ter", score: 5 },
  { day: "Qua", score: 2 },
  { day: "Qui", score: 7 },
  { day: "Sex", score: 4 },
  { day: "Sáb", score: 6 },
  { day: "Dom", score: 8 },
];

const Progress = () => {
  const navigate = useNavigate();
  useSpeech("Seu progresso. Continue praticando!");

  const maxScore = Math.max(...weeklyData.map((d) => d.score));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-6 pt-8">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2 mb-4">
          <span aria-hidden="true">🏆</span> Meu Progresso
        </h1>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-3xl p-6 shadow-lg mb-6 flex items-center gap-4"
        >
          <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center text-4xl shadow-md" aria-hidden="true">
            ⭐
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground">Nível atual</p>
            <p className="text-4xl font-black text-foreground">1</p>
            <p className="text-sm font-semibold text-muted-foreground">Iniciante</p>
          </div>
        </motion.div>

        <div className="bg-card rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-foreground">Progresso Geral</p>
            <p className="font-bold text-primary">25%</p>
          </div>
          <div className="bg-muted rounded-full h-6" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso geral: 25%">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "25%" }}
              transition={{ duration: 1 }}
              className="bg-primary h-6 rounded-full"
            />
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-lg mb-6">
          <h2 className="font-black text-foreground flex items-center gap-2 mb-4">
            <span aria-hidden="true">📊</span> Atividade desta Semana
          </h2>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.score / maxScore) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full bg-primary rounded-t-lg min-h-[4px]"
                  title={`${d.day}: ${d.score} pontos`}
                />
                <span className="text-xs font-bold text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/progress-map")}
          className="w-full bg-card rounded-3xl p-5 shadow-lg mb-6 flex items-center gap-4"
          aria-label="Ver mapa da jornada"
        >
          <span className="text-4xl" aria-hidden="true">🗺️</span>
          <span className="flex-1 text-left font-black text-foreground text-lg">
            Mapa da Jornada
          </span>
          <span className="text-3xl" aria-hidden="true">▶️</span>
        </motion.button>

        <h2 className="font-black text-foreground mb-3 flex items-center gap-2">
          <span aria-hidden="true">🎖️</span> Conquistas
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-card rounded-2xl p-4 flex flex-col items-center shadow-md gap-1 ${
                !ach.unlocked ? "opacity-40 grayscale" : ""
              }`}
              title={ach.title}
            >
              <span className="text-3xl" role="img" aria-label={ach.title}>{ach.icon}</span>
              <span className="text-xs font-bold text-muted-foreground text-center leading-tight">
                {ach.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Progress;
