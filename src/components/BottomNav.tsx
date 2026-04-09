import { Home, BookOpen, Trophy, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useSpeech from "@/hooks/useSpeech";

const navItems = [
  { icon: Home,     path: "/dashboard", label: "Início",      speech: "Indo para o início!" },
  { icon: BookOpen, path: "/modules",   label: "Aprender",    speech: "Indo para aprender!" },
  { icon: Trophy,   path: "/progress",  label: "Progresso",   speech: "Vendo o seu progresso!" },
  { icon: Settings, path: "/settings",  label: "Configurações", speech: "Configurações!" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { speak } = useSpeech("", false);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border z-50"
      aria-label="Navegação principal"
    >
      <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                speak(item.speech);
                navigate(item.path);
              }}
              className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-colors"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`p-2 rounded-2xl ${isActive ? "bg-primary" : ""}`}
              >
                <item.icon
                  size={28}
                  className={isActive ? "text-primary-foreground" : "text-muted-foreground"}
                  aria-hidden="true"
                />
              </motion.div>
              <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
