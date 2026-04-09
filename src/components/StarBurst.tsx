import { motion, AnimatePresence } from "framer-motion";

interface StarBurstProps {
  show: boolean;
  onComplete?: () => void;
}

const StarBurst = ({ show, onComplete }: StarBurstProps) => {
  const stars = Array.from({ length: 8 });

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          {stars.map((_, i) => {
            const angle = (i / stars.length) * Math.PI * 2;
            const x = Math.cos(angle) * 150;
            const y = Math.sin(angle) * 150;
            return (
              <motion.span
                key={i}
                className="absolute text-4xl"
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ scale: [0, 1.5, 0], x, y, opacity: [1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: i * 0.05 }}
              >
                ⭐
              </motion.span>
            );
          })}
          <motion.span
            className="absolute text-7xl"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            🌟
          </motion.span>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StarBurst;
