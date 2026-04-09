import { Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { playBeep } from "@/lib/audio";

interface AudioButtonProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

const sizeMap = {
  sm: { icon: 20, button: "p-2" },
  md: { icon: 28, button: "p-3" },
  lg: { icon: 36, button: "p-4" },
  xl: { icon: 48, button: "p-6" },
};

const AudioButton = ({
  size = "md",
  className = "",
  onClick,
  "aria-label": ariaLabel = "Ouvir",
}: AudioButtonProps) => {
  const s = sizeMap[size];

  const handleClick = () => {
    playBeep("click");
    onClick?.();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`bg-accent rounded-full shadow-md ${s.button} ${className}`}
    >
      <Volume2 size={s.icon} className="text-accent-foreground" aria-hidden="true" />
    </motion.button>
  );
};

export default AudioButton;
