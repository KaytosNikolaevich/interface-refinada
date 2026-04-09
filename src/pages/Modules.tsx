import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { modules } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";
import useSpeech from "@/hooks/useSpeech";

const Modules = () => {
  const navigate = useNavigate();
  const { speak } = useSpeech(
    "Escolha um módulo para começar. Toque no que você quer aprender."
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="px-6 pt-8 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-xl bg-card shadow"
          aria-label="Voltar ao início"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <span aria-hidden="true">📚</span> Módulos
        </h1>
      </header>

      <section className="px-6 space-y-4" aria-label="Lista de módulos">
        {modules.map((mod, i) => {
          const progressPct = Math.round((mod.completedLessons / mod.lessonsCount) * 100);
          return (
            <motion.button
              key={mod.id}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                speak(mod.title);
                setTimeout(() => navigate(`/lesson/${mod.id}`), 600);
              }}
              className="card-module w-full flex items-center gap-4 text-left"
              aria-label={`${mod.title}: ${mod.description}. ${progressPct}% concluído`}
            >
              <div className={`${mod.color} rounded-2xl p-4 text-4xl shrink-0`} aria-hidden="true">
                {mod.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black text-foreground leading-tight">{mod.title}</p>
                <p className="text-sm text-muted-foreground font-semibold truncate">{mod.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-muted rounded-full h-2.5" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
                    <div
                      className={`${mod.color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground w-10 text-right">
                    {progressPct}%
                  </span>
                </div>
              </div>
              <span className="text-3xl shrink-0" aria-hidden="true">▶️</span>
            </motion.button>
          );
        })}
      </section>

      <BottomNav />
    </div>
  );
};

export default Modules;
