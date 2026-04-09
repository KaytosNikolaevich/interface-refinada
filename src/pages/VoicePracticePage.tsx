import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Mic, MicOff } from "lucide-react";
import useSpeech from "@/hooks/useSpeech";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import AudioButton from "@/components/AudioButton";
import MascotHelper from "@/components/MascotHelper";
import { playBeep } from "@/lib/audio";

interface PracticeItem {
  text: string;
  type: "letra" | "silaba" | "palavra";
  emoji: string;
}

const practiceItems: PracticeItem[] = [
  { text: "A",     type: "letra",   emoji: "🍎" },
  { text: "E",     type: "letra",   emoji: "⭐" },
  { text: "I",     type: "letra",   emoji: "🏝️" },
  { text: "O",     type: "letra",   emoji: "👁️" },
  { text: "U",     type: "letra",   emoji: "🍇" },
  { text: "BA",    type: "silaba",  emoji: "🍌" },
  { text: "MA",    type: "silaba",  emoji: "👩" },
  { text: "PA",    type: "silaba",  emoji: "👨" },
  { text: "BOLA",  type: "palavra", emoji: "⚽" },
  { text: "CASA",  type: "palavra", emoji: "🏠" },
  { text: "GATO",  type: "palavra", emoji: "🐱" },
  { text: "SOL",   type: "palavra", emoji: "☀️" },
];

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const VoicePracticePage = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);

  const item = practiceItems[currentIdx];
  const { speak } = useSpeech("", false);

  const handleCorrect = useCallback(() => {
    setFeedback("correct");
    setScore((s) => s + 1);
    speak("Muito bem! Você falou corretamente!");
    playBeep("correct");
    setTimeout(() => {
      setFeedback(null);
      setCurrentIdx((i) => i + 1);
    }, 2000);
  }, [speak]);

  const handleResult = useCallback(
    (transcript: string) => {
      if (!item) return;
      const said = normalize(transcript);
      const expected = normalize(item.text);
      const isCorrect = said.includes(expected) || expected.includes(said);

      if (isCorrect) {
        handleCorrect();
      } else {
        setFeedback("wrong");
        playBeep("wrong");
        speak(`Tente de novo: ${item.text}`);
        setTimeout(() => setFeedback(null), 2000);
      }
    },
    [item, speak, handleCorrect],
  );

  const { isSupported, isListening, transcript, startListening, stopListening } =
    useSpeechRecognition({ onResult: handleResult });

  const handleTouchSelect = (selectedText: string) => {
    if (!item) return;
    if (selectedText === item.text) {
      handleCorrect();
    } else {
      setFeedback("wrong");
      playBeep("wrong");
      speak(`Não é essa. Tente: ${item.text}`);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  /* Tela de conclusão */
  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-4">
          🎤
        </motion.div>
        <h2 className="text-2xl font-black text-foreground mb-2">Excelente!</h2>
        <p className="text-muted-foreground font-bold mb-6 text-center">
          Você praticou todas as palavras!
        </p>
        <div
          className="flex gap-1 mb-8"
          aria-label={`Pontuação: ${score} de ${practiceItems.length}`}
        >
          {practiceItems.map((_, i) => (
            <span key={i} className="text-2xl" aria-hidden="true">
              {i < score ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/dashboard")}
          className="btn-learning bg-primary text-primary-foreground w-full max-w-sm flex items-center justify-center gap-3"
        >
          <span aria-hidden="true">🏠</span>
          <span>Voltar ao Início</span>
        </motion.button>
      </div>
    );
  }

  /* Opções de toque (fallback) */
  const allTexts = practiceItems.map((p) => p.text).filter((t) => t !== item.text);
  const touchOptions = [item.text];
  const pool = [...allTexts];
  while (touchOptions.length < 3 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    touchOptions.push(pool.splice(idx, 1)[0]);
  }
  const shuffledOptions = [...touchOptions].sort(() => Math.random() - 0.5);

  const typeLabel =
    item.type === "letra" ? "Letra" : item.type === "silaba" ? "Sílaba" : "Palavra";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 pt-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-xl bg-card shadow"
          aria-label="Voltar ao início"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div
          className="flex-1 bg-muted rounded-full h-3"
          role="progressbar"
          aria-valuenow={Math.round(((currentIdx + 1) / practiceItems.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Item ${currentIdx + 1} de ${practiceItems.length}`}
        >
          <div
            className="bg-accent h-3 rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / practiceItems.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-muted-foreground w-14 text-right">
          {currentIdx + 1}/{practiceItems.length}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          key={currentIdx}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-6 w-full max-w-sm"
        >
          <span className="text-8xl" role="img" aria-label={`Imagem de ${item.text}`}>
            {item.emoji}
          </span>

          <div className="bg-card rounded-3xl px-16 py-8 shadow-lg border-2 border-border text-center">
            <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
              {typeLabel}
            </p>
            <h2 className="text-7xl font-black text-foreground">{item.text}</h2>
          </div>

          <AudioButton
            size="xl"
            onClick={() => speak(item.text)}
            aria-label={`Ouvir: ${item.text}`}
          />

          {!isSupported ? (
            <>
              <p className="text-sm text-muted-foreground font-bold text-center px-4">
                Seu navegador não suporta reconhecimento de voz. Modo de toque ativado.
              </p>
              <div
                className="grid grid-cols-3 gap-3 w-full"
                role="group"
                aria-label="Escolha a opção correta"
              >
                {shuffledOptions.map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTouchSelect(opt)}
                    className="bg-card rounded-2xl p-4 shadow-md border-2 border-border"
                    aria-label={`Opção: ${opt}`}
                  >
                    <span className="text-2xl font-black text-foreground block text-center">{opt}</span>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              animate={isListening ? { scale: [1, 1.15, 1] } : {}}
              transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
              onClick={isListening ? stopListening : startListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-colors ${
                isListening ? "bg-destructive" : "bg-primary"
              }`}
              aria-label={isListening ? "Parar gravação" : "Começar a falar"}
              aria-pressed={isListening}
            >
              {isListening ? (
                <MicOff size={40} className="text-destructive-foreground" aria-hidden="true" />
              ) : (
                <Mic size={40} className="text-primary-foreground" aria-hidden="true" />
              )}
            </motion.button>
          )}

          {isListening && transcript && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-muted-foreground"
              aria-live="polite"
            >
              Ouvi: "{transcript}"
            </motion.p>
          )}

          {feedback && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-center p-4 rounded-2xl w-full ${
                feedback === "correct" ? "bg-success/20" : "bg-destructive/20"
              }`}
              role="alert"
              aria-live="assertive"
            >
              <span className="text-5xl" aria-hidden="true">
                {feedback === "correct" ? "🎉" : "💪"}
              </span>
              <p className="font-black text-foreground mt-1">
                {feedback === "correct" ? "Correto!" : "Tente outra vez!"}
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>

      <MascotHelper instruction={`Diga: ${item.text}`} />
    </div>
  );
};

export default VoicePracticePage;
