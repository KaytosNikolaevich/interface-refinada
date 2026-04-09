import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import AudioButton from "@/components/AudioButton";
import MascotHelper from "@/components/MascotHelper";
import useSpeech from "@/hooks/useSpeech";

interface StoryWord {
  word: string;
  isMissing: boolean;
  options?: string[];
}

interface Story {
  id: string;
  title: string;
  emoji: string;
  words: StoryWord[];
  fullText: string;
}

const stories: Story[] = [
  {
    id: "s1",
    title: "O Gato e o Sol",
    emoji: "🐱",
    fullText: "O gato dormia no sol. Ele era bonito e feliz.",
    words: [
      { word: "O", isMissing: false },
      { word: "gato", isMissing: true, options: ["gato", "pato", "rato"] },
      { word: "dormia", isMissing: false },
      { word: "no", isMissing: false },
      { word: "sol", isMissing: true, options: ["sol", "sal", "sul"] },
      { word: ".", isMissing: false },
      { word: "Ele", isMissing: false },
      { word: "era", isMissing: false },
      { word: "bonito", isMissing: true, options: ["bonito", "boneco", "banana"] },
      { word: "e", isMissing: false },
      { word: "feliz", isMissing: false },
      { word: ".", isMissing: false },
    ],
  },
  {
    id: "s2",
    title: "A Casa da Vovó",
    emoji: "🏠",
    fullText: "A casa da vovó é grande. Tem um jardim com flores bonitas.",
    words: [
      { word: "A", isMissing: false },
      { word: "casa", isMissing: true, options: ["casa", "mesa", "vaso"] },
      { word: "da", isMissing: false },
      { word: "vovó", isMissing: false },
      { word: "é", isMissing: false },
      { word: "grande", isMissing: true, options: ["grande", "verde", "triste"] },
      { word: ".", isMissing: false },
      { word: "Tem", isMissing: false },
      { word: "um", isMissing: false },
      { word: "jardim", isMissing: false },
      { word: "com", isMissing: false },
      { word: "flores", isMissing: true, options: ["flores", "cores", "dores"] },
      { word: "bonitas", isMissing: false },
      { word: ".", isMissing: false },
    ],
  },
  {
    id: "s3",
    title: "O Cachorro Brincalhão",
    emoji: "🐕",
    fullText: "O cachorro corre no parque. Ele brinca com a bola azul.",
    words: [
      { word: "O", isMissing: false },
      { word: "cachorro", isMissing: true, options: ["cachorro", "cavalo", "coelho"] },
      { word: "corre", isMissing: false },
      { word: "no", isMissing: false },
      { word: "parque", isMissing: true, options: ["parque", "barco", "banco"] },
      { word: ".", isMissing: false },
      { word: "Ele", isMissing: false },
      { word: "brinca", isMissing: false },
      { word: "com", isMissing: false },
      { word: "a", isMissing: false },
      { word: "bola", isMissing: true, options: ["bola", "mola", "cola"] },
      { word: "azul", isMissing: false },
      { word: ".", isMissing: false },
    ],
  },
];

const StoriesPage = () => {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentMissing, setCurrentMissing] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const missingWords = selectedStory?.words
    .map((w, i) => ({ ...w, index: i }))
    .filter((w) => w.isMissing) ?? [];

  const currentWord = missingWords[currentMissing];
  const { speak } = useSpeech("", false);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (!currentWord) return;
      const correct = option === currentWord.word;

      if (correct) {
        speak("Muito bem!");
        setAnswers((prev) => ({ ...prev, [currentWord.index]: option }));
      } else {
        speak(`A palavra certa é: ${currentWord.word}`);
        setAnswers((prev) => ({ ...prev, [currentWord.index]: currentWord.word }));
      }

      setTimeout(() => {
        if (currentMissing < missingWords.length - 1) {
          setCurrentMissing((i) => i + 1);
        } else {
          setShowResult(true);
        }
      }, 1500);
    },
    [currentWord, currentMissing, missingWords, speak],
  );

  /* Lista de histórias */
  if (!selectedStory) {
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
            <span aria-hidden="true">📖</span> Histórias
          </h1>
        </header>

        <section className="px-6 space-y-4" aria-label="Lista de histórias">
          {stories.map((story, i) => (
            <motion.button
              key={story.id}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSelectedStory(story);
                setAnswers({});
                setCurrentMissing(0);
                setShowResult(false);
                speak(`História: ${story.title}`);
              }}
              className="card-module w-full flex items-center gap-4 text-left"
              aria-label={`Ouvir história: ${story.title}`}
            >
              <div className="bg-secondary rounded-2xl p-4 text-5xl shrink-0" aria-hidden="true">
                {story.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-black text-foreground">{story.title}</p>
                <p className="text-sm text-muted-foreground font-semibold">
                  {story.words.filter((w) => w.isMissing).length} palavras para descobrir
                </p>
              </div>
              <span className="text-3xl shrink-0" aria-hidden="true">▶️</span>
            </motion.button>
          ))}
        </section>
      </div>
    );
  }

  /* Tela de resultado */
  if (showResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-4">
          🎉
        </motion.div>
        <h2 className="text-2xl font-black text-foreground mb-2">Parabéns!</h2>
        <p className="text-muted-foreground font-bold mb-6 text-center">
          Você completou a história "{selectedStory.title}"!
        </p>
        <div
          className="flex gap-1 mb-8"
          aria-label={`Pontuação: ${missingWords.filter((mw) => answers[mw.index] === mw.word).length} de ${missingWords.length} estrelas`}
        >
          {missingWords.map((mw, i) => (
            <span key={i} className="text-3xl" aria-hidden="true">
              {answers[mw.index] === mw.word ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <div className="space-y-3 w-full max-w-sm">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setSelectedStory(null)}
            className="btn-learning bg-primary text-primary-foreground w-full flex items-center justify-center gap-3"
          >
            <span aria-hidden="true">📖</span>
            <span>Mais Histórias</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/dashboard")}
            className="btn-learning bg-card text-foreground border-2 border-border w-full flex items-center justify-center gap-3"
          >
            <span aria-hidden="true">🏠</span>
            <span>Voltar ao Início</span>
          </motion.button>
        </div>
      </div>
    );
  }

  /* Leitura da história */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 pt-6 flex items-center gap-3">
        <button
          onClick={() => setSelectedStory(null)}
          className="p-2 rounded-xl bg-card shadow"
          aria-label="Voltar à lista de histórias"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div
          className="flex-1 bg-muted rounded-full h-3"
          role="progressbar"
          aria-valuenow={Math.round(((currentMissing + 1) / missingWords.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Palavra ${currentMissing + 1} de ${missingWords.length}`}
        >
          <div
            className="bg-secondary h-3 rounded-full transition-all"
            style={{ width: `${((currentMissing + 1) / missingWords.length) * 100}%` }}
          />
        </div>
      </header>

      <main className="px-6 pt-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-5xl" aria-hidden="true">{selectedStory.emoji}</span>
          <h2 className="text-xl font-black text-foreground">{selectedStory.title}</h2>
          <AudioButton
            size="lg"
            onClick={() => speak(selectedStory.fullText)}
            aria-label="Ouvir história completa"
          />
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-lg mb-6 mt-4">
          <div className="flex flex-wrap gap-1 text-xl font-bold leading-relaxed">
            {selectedStory.words.map((w, i) => {
              if (!w.isMissing) {
                return <span key={i} className="text-foreground">{w.word}</span>;
              }
              const answer = answers[i];
              if (answer) {
                return (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded-lg ${
                      answer === w.word ? "bg-success/20 text-foreground" : "bg-destructive/20 text-foreground"
                    }`}
                  >
                    {answer}
                  </span>
                );
              }
              const isCurrent = currentWord?.index === i;
              return (
                <span
                  key={i}
                  className={`px-4 py-0.5 rounded-lg border-2 border-dashed ${
                    isCurrent ? "border-secondary bg-secondary/10" : "border-muted"
                  }`}
                >
                  ___
                </span>
              );
            })}
          </div>
        </div>

        {currentWord?.options && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-muted-foreground text-center mb-2">
              Qual palavra completa a frase?
            </p>
            {currentWord.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  speak(opt);
                  handleSelectOption(opt);
                }}
                className="card-module w-full text-center"
                aria-label={`Opção: ${opt}`}
              >
                <span className="text-2xl font-black text-card-foreground">{opt}</span>
              </motion.button>
            ))}
          </div>
        )}
      </main>

      <MascotHelper instruction="Qual palavra completa a frase? Escolha entre as opções." />
    </div>
  );
};

export default StoriesPage;
