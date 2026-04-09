import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Check, X } from "lucide-react";
import { exercises } from "@/data/mockData";
import AudioButton from "@/components/AudioButton";
import useSpeech from "@/hooks/useSpeech";
import MascotHelper from "@/components/MascotHelper";
import StarBurst from "@/components/StarBurst";
import { playBeep } from "@/lib/audio";

const ExercisePage = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showStarBurst, setShowStarBurst] = useState(false);

  const exercise = exercises[currentIdx];
  const { speak } = useSpeech("", false);

  useEffect(() => {
    if (exercise) {
      const timer = setTimeout(() => speak(exercise.questionText), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, exercise, speak]);

  if (!exercise) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-4">
          🎉
        </motion.div>
        <h1 className="text-3xl font-black text-foreground mb-2 text-center">Parabéns!</h1>
        <p className="text-muted-foreground font-bold mb-6 text-center">
          Você completou todos os exercícios!
        </p>
        <div className="flex gap-1 mb-8" aria-label={`Pontuação: ${score} de ${exercises.length} estrelas`}>
          {Array.from({ length: exercises.length }).map((_, i) => (
            <span key={i} className="text-3xl" aria-hidden="true">
              {i < score ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/dashboard")}
          className="btn-learning bg-primary text-primary-foreground w-full max-w-sm flex items-center justify-center gap-3"
        >
          <span className="text-3xl" aria-hidden="true">🏠</span>
          <span>Voltar ao Início</span>
        </motion.button>
      </div>
    );
  }

  const handleSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelected(optionId);
    const option = exercise.options.find((o) => o.id === optionId);
    const correct = option?.isCorrect ?? false;
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
      setShowStarBurst(true);
      setTimeout(() => setShowStarBurst(false), 1200);
      playBeep("correct");
      speak("Muito bem! Você acertou!");
    } else {
      playBeep("wrong");
      speak("Não foi dessa vez. Tente de novo na próxima!");
    }

    setShowFeedback(true);
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    setCurrentIdx((i) => i + 1);
  };

  const progressPct = Math.round(((currentIdx + 1) / exercises.length) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StarBurst show={showStarBurst} />

      <header className="px-6 pt-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/modules")}
          className="p-2 rounded-xl bg-card shadow"
          aria-label="Voltar aos módulos"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div
          className="flex-1 bg-muted rounded-full h-3"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Exercício ${currentIdx + 1} de ${exercises.length}`}
        >
          <div
            className="bg-secondary h-3 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-muted-foreground w-14 text-right">
          {currentIdx + 1}/{exercises.length}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pt-8">
        <AudioButton
          size="xl"
          className="mb-6"
          onClick={() => speak(exercise.questionText)}
          aria-label="Ouvir a pergunta novamente"
        />

        <h2 className="sr-only">{exercise.questionText}</h2>

        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          {exercise.options.map((option) => {
            let borderClass = "border-border";
            if (showFeedback && selected === option.id) {
              borderClass = isCorrect ? "border-success" : "border-destructive";
            }
            if (showFeedback && option.isCorrect) {
              borderClass = "border-success";
            }

            return (
              <motion.button
                key={option.id}
                whileTap={!showFeedback ? { scale: 0.95 } : {}}
                animate={
                  showFeedback && selected === option.id && !isCorrect
                    ? { x: [0, -8, 8, -8, 0] }
                    : {}
                }
                onClick={() => {
                  speak(option.content);
                  handleSelect(option.id);
                }}
                disabled={showFeedback}
                className={`card-module flex items-center justify-center gap-4 border-[3px] ${borderClass}`}
                aria-label={`Opção: ${option.content}`}
                aria-pressed={selected === option.id}
              >
                <img
                  src={option.imageUrl}
                  alt={option.content}
                  className="w-[120px] h-[120px] object-contain"
                  loading="lazy"
                />
                <span className="text-2xl font-black text-card-foreground">{option.content}</span>
                {showFeedback && option.isCorrect && (
                  <Check className="text-success" size={28} aria-hidden="true" />
                )}
                {showFeedback && selected === option.id && !option.isCorrect && (
                  <X className="text-destructive" size={28} aria-hidden="true" />
                )}
              </motion.button>
            );
          })}
        </div>
      </main>

      {showFeedback && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className={`px-6 py-6 ${isCorrect ? "bg-success/10" : "bg-destructive/10"}`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl" aria-hidden="true">{isCorrect ? "🎉" : "💪"}</span>
            <p className="font-black text-foreground text-lg">
              {isCorrect ? "Muito bem! Você acertou!" : "Não foi dessa vez. Continue!"}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleNext}
            className="btn-learning bg-primary text-primary-foreground w-full flex items-center justify-center gap-3"
          >
            <span className="text-2xl" aria-hidden="true">➡️</span>
            <span>Continuar</span>
          </motion.button>
        </motion.div>
      )}

      <MascotHelper instruction={exercise.questionText} />
    </div>
  );
};

export default ExercisePage;
