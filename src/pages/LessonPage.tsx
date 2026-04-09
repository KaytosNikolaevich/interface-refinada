import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { lessons } from "@/data/mockData";
import AudioButton from "@/components/AudioButton";
import MascotHelper from "@/components/MascotHelper";
import useSpeech from "@/hooks/useSpeech";

const LessonPage = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const moduleLessons = lessons.filter((l) => l.moduleId === moduleId);
  const [current, setCurrent] = useState(0);

  const lesson = moduleLessons[current];
  const { speak } = useSpeech("", false);

  useEffect(() => {
    if (lesson) {
      const text =
        lesson.contentType === "letra"
          ? `Esta é a letra ${lesson.textContent}. Letra ${lesson.textContent}.`
          : lesson.contentType === "silaba"
          ? `Esta é a sílaba ${lesson.textContent}. ${lesson.textContent}.`
          : `Esta é a palavra ${lesson.textContent}. ${lesson.textContent}.`;
      const timer = setTimeout(() => speak(text), 500);
      return () => clearTimeout(timer);
    }
  }, [current, lesson, speak]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 gap-4">
        <span className="text-6xl" aria-hidden="true">📚</span>
        <p className="text-lg font-black text-muted-foreground text-center">
          Nenhuma lição encontrada para este módulo.
        </p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/modules")}
          className="btn-learning bg-primary text-primary-foreground flex items-center gap-2"
          aria-label="Voltar aos módulos"
        >
          <ChevronLeft size={24} />
          <span>Voltar aos Módulos</span>
        </motion.button>
      </div>
    );
  }

  const goNext = () => {
    if (current < moduleLessons.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate(`/exercise/${moduleId}`);
    }
  };

  const currentInstruction =
    lesson.contentType === "letra"
      ? `Letra ${lesson.textContent}`
      : lesson.textContent;

  const progressPct = Math.round(((current + 1) / moduleLessons.length) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          aria-label={`Lição ${current + 1} de ${moduleLessons.length}`}
        >
          <motion.div
            className="bg-primary h-3 rounded-full"
            animate={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-sm font-bold text-muted-foreground w-14 text-right">
          {current + 1}/{moduleLessons.length}
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={lesson.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="flex flex-col items-center gap-6 w-full max-w-sm"
          >
            <img
              src={lesson.imageUrl}
              alt={`Imagem representando ${lesson.textContent}`}
              className="w-48 h-48 object-contain drop-shadow-lg"
              loading="lazy"
            />

            <div className="bg-card rounded-3xl px-12 py-6 shadow-lg border-2 border-border">
              <h2 className="text-6xl font-black text-foreground text-center">
                {lesson.textContent}
              </h2>
            </div>

            <AudioButton
              size="xl"
              onClick={() => speak(currentInstruction)}
              aria-label={`Ouvir: ${currentInstruction}`}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="px-6 pb-8">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={goNext}
          className="btn-learning bg-primary text-primary-foreground w-full flex items-center justify-center gap-3"
          aria-label={current < moduleLessons.length - 1 ? "Próxima lição" : "Ir para os exercícios"}
        >
          {current < moduleLessons.length - 1 ? (
            <>
              <ArrowRight size={28} aria-hidden="true" />
              <span>Próxima</span>
            </>
          ) : (
            <>
              <span className="text-3xl" aria-hidden="true">🎮</span>
              <span>Exercícios</span>
            </>
          )}
        </motion.button>
      </div>

      <MascotHelper instruction={currentInstruction} />
    </div>
  );
};

export default LessonPage;
