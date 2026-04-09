import { motion, AnimatePresence } from "framer-motion";
import useSpeech from "@/hooks/useSpeech";

interface AchievementOverlayProps {
  show: boolean;
  icon: string;
  title: string;
  onClose: () => void;
}

const AchievementOverlay = ({ show, icon, title, onClose }: AchievementOverlayProps) => {
  const { speak } = useSpeech("", false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center"
          onClick={onClose}
          onAnimationComplete={() => {
            speak(`Conquista desbloqueada: ${title}`);
            setTimeout(onClose, 3000);
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            exit={{ scale: 0 }}
            className="bg-card rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl"
          >
            <span className="text-7xl">{icon}</span>
            <p className="text-2xl font-black text-foreground">{title}</p>
            <p className="text-muted-foreground font-bold">Conquista Desbloqueada! 🎉</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementOverlay;
