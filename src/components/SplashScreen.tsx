import { motion } from "framer-motion";

const SplashScreen = () => (
  <div
    className="min-h-screen flex flex-col items-center justify-center bg-background"
    role="status"
    aria-label="Carregando ABC Aventura"
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="text-8xl mb-4"
      aria-hidden="true"
    >
      📚
    </motion.div>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-xl font-black text-foreground"
    >
      Carregando...
    </motion.p>
  </div>
);

export default SplashScreen;
