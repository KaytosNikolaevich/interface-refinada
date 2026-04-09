import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useSpeech from "@/hooks/useSpeech";

const Welcome = () => {
  const navigate = useNavigate();
  const { speak } = useSpeech("", false);

  useEffect(() => {
    const timer = setTimeout(() => {
      speak("Olá! Bem-vindo ao ABC Aventura! Toque no botão verde para começar!");
    }, 800);
    return () => clearTimeout(timer);
  }, [speak]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="flex flex-col items-center gap-6 max-w-sm w-full"
      >
        <motion.span
          className="text-[120px] leading-none"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          role="img"
          aria-label="Coruja mascote"
        >
          🦉
        </motion.span>

        <h1 className="text-3xl font-black text-foreground text-center leading-tight">
          Aprenda a Ler! 📚
        </h1>
        <p className="text-lg font-semibold text-muted-foreground text-center">
          Seu caminho para a leitura começa aqui
        </p>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: "📖", label: "Leitura" },
            { icon: "🎧", label: "Áudio" },
            { icon: "🎮", label: "Jogos" },
          ].map(({ icon, label }) => (
            <motion.div
              key={label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card rounded-2xl p-4 shadow-md flex flex-col items-center gap-1"
            >
              <span className="text-4xl" role="img" aria-label={label}>{icon}</span>
              <span className="text-xs font-bold text-muted-foreground">{label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/register")}
          className="btn-learning bg-primary text-primary-foreground w-full text-center mt-4 animate-pulse-glow flex items-center justify-center gap-3"
          aria-label="Começar a aprender"
        >
          <span className="text-4xl" aria-hidden="true">▶️</span>
          <span className="text-2xl">Começar</span>
        </motion.button>
      </motion.div>
    </main>
  );
};

export default Welcome;
