import { motion } from "framer-motion";
import useSpeech from "@/hooks/useSpeech";

interface MascotHelperProps {
  instruction: string;
}

const MascotHelper = ({ instruction }: MascotHelperProps) => {
  const { speak } = useSpeech("", false);

  return (
    <motion.button
      onClick={() => speak(instruction)}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        repeatDelay: 6.5,
      }}
      className="fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full bg-primary shadow-xl flex items-center justify-center text-3xl"
      aria-label="Ouvir instrução novamente"
    >
      🦉
    </motion.button>
  );
};

export default MascotHelper;
