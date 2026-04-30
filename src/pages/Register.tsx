import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { avatars } from "@/data/mockData";
import useSpeech from "@/hooks/useSpeech";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [childName, setChildName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const { speak } = useSpeech("", false);

  useEffect(() => {
    if (step === 1) {
      const timer = setTimeout(() => {
        speak("Quem é você? Toque no seu personagem favorito!");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, speak]);

  const handleAvatarSelect = (idx: number) => {
    setSelectedAvatar(idx);
    speak(avatars[idx]);
  };

  const handleContinue = () => {
    if (step === 1 && selectedAvatar !== null) {
      setStep(2);
      speak("Agora, um recado para os pais!");
    } else if (step === 2) {
      localStorage.setItem("child_avatar", avatars[selectedAvatar ?? 0]);
      localStorage.setItem("child_name", childName);
      navigate("/dashboard");
    }
  };

  if (step === 1) {
    return (
      <main className="min-h-screen flex flex-col items-center px-6 py-10 bg-background">
        <motion.span
          className="text-[80px] leading-none mb-2"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          role="img"
          aria-label="Coruja mascote"
        >
          🦉
        </motion.span>

        <h1 className="text-2xl font-black text-foreground mb-6 text-center">
          Escolha seu personagem!
        </h1>

        <div className="grid grid-cols-4 gap-4 mb-8" role="group" aria-label="Avatares disponíveis">
          {avatars.map((av, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleAvatarSelect(i)}
              aria-label={`Avatar ${av}`}
              aria-pressed={selectedAvatar === i}
              className={`text-5xl p-3 rounded-2xl border-[3px] transition-all min-w-[80px] min-h-[80px] flex items-center justify-center ${
                selectedAvatar === i
                  ? "border-primary bg-primary/10 shadow-lg scale-110"
                  : "border-border bg-card"
              }`}
            >
              {av}
            </motion.button>
          ))}
        </div>

        {selectedAvatar !== null && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleContinue}
            className="btn-learning bg-primary text-primary-foreground w-full max-w-sm flex items-center justify-center gap-3"
          >
            <span className="text-3xl" aria-hidden="true">✅</span>
            <span className="text-xl">Continuar</span>
          </motion.button>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-10 bg-background">
      <div className="bg-secondary/20 rounded-2xl p-4 mb-6 w-full max-w-sm">
        <p className="text-lg font-black text-foreground text-center">
          👨‍👩‍👧 Esta parte é para os pais
        </p>
      </div>

      <div className="text-6xl mb-6" role="img" aria-label="Avatar selecionado">
        {avatars[selectedAvatar ?? 0]}
      </div>

      <div className="w-full max-w-sm space-y-4 mb-8">
        <div>
          <label htmlFor="child-name" className="text-sm font-bold text-muted-foreground mb-1 block">
            Nome da criança
          </label>
          <input
            id="child-name"
            type="text"
            placeholder="Nome"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-card border-2 border-border text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="parent-email" className="text-sm font-bold text-muted-foreground mb-1 block">
            E-mail dos pais (opcional)
          </label>
          <input
            id="parent-email"
            type="email"
            placeholder="email@exemplo.com"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-card border-2 border-border text-lg font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleContinue}
        className="btn-learning bg-primary text-primary-foreground w-full max-w-sm flex items-center justify-center gap-3"
      >
        <span aria-hidden="true">✅</span>
        <span>Pronto! Vamos começar!</span>
      </motion.button>
    </main>
  );
};

export default Register;
