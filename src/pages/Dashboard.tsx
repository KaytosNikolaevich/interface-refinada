import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import useSpeech from "@/hooks/useSpeech";

const Dashboard = () => {
  const navigate = useNavigate();
  const { speak } = useSpeech("", false);

  const childAvatar = localStorage.getItem("child_avatar") || "🧑";
  const childName = localStorage.getItem("child_name") || "Aventureiro";

  const actions = [
    { label: "Aprender", emoji: "📚", color: "bg-secondary", path: "/modules",        speech: "Vamos aprender!" },
    { label: "Histórias", emoji: "📖", color: "bg-accent",   path: "/stories",        speech: "Ouvir histórias!" },
    { label: "Praticar Voz", emoji: "🎤", color: "bg-warning", path: "/voice-practice", speech: "Praticar sua voz!" },
  ];

  const stats = [
    { value: "📖", label: "Aulas" },
    { value: "✅", label: "Acertos" },
    { value: "⭐", label: "Nível" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-primary px-6 pt-10 pb-12 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl bg-card rounded-full p-1" role="img" aria-label="Avatar do usuário">
            {childAvatar}
          </span>
          <div>
            <p className="text-primary-foreground font-black text-xl">
              Olá, {childName}! 👋
            </p>
          </div>
        </div>

        <div className="bg-primary-foreground/20 rounded-full h-4 mt-4" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso geral: 25%">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "25%" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-primary-foreground h-4 rounded-full"
          />
        </div>
        <p className="text-primary-foreground/80 text-sm font-semibold mt-1">25% concluído</p>
      </header>

      <section className="px-6 -mt-6 space-y-3" aria-label="Ações rápidas">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              speak(action.speech);
              navigate(action.path);
            }}
            className={`w-full ${action.color} rounded-3xl p-5 flex items-center gap-4 shadow-lg`}
          >
            <span className="text-5xl" role="img" aria-hidden="true">{action.emoji}</span>
            <span className="text-xl font-black text-primary-foreground flex-1 text-left">
              {action.label}
            </span>
            <ArrowRight className="text-primary-foreground" size={32} aria-hidden="true" />
          </motion.button>
        ))}
      </section>

      <section className="px-6 mt-6 grid grid-cols-3 gap-3" aria-label="Estatísticas">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="bg-card rounded-2xl p-4 flex flex-col items-center shadow-md gap-1"
          >
            <span className="text-3xl" role="img" aria-hidden="true">{stat.value}</span>
            <span className="text-xs font-bold text-muted-foreground">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
