import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

export function ThemeToggle({ className = "", size = "md" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const iconClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={toggle}
      className={cn(
        "relative flex items-center justify-center rounded-xl p-2.5",
        "text-slate-600 dark:text-slate-200",
        "bg-white/70 dark:bg-slate-800/70",
        "border border-slate-200/80 dark:border-slate-600/50",
        "shadow-sm shadow-slate-900/5 dark:shadow-black/20",
        "hover:border-violet-400/40 dark:hover:border-cyan-400/35",
        "hover:shadow-lg hover:shadow-violet-500/10 dark:hover:shadow-cyan-500/10",
        "transition-shadow duration-300",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.span
        initial={false}
        animate={{ rotate: isDark ? 180 : 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="inline-flex"
      >
        {isDark ? (
          <Sun className={cn(iconClass, "text-amber-300")} />
        ) : (
          <Moon className={cn(iconClass, "text-violet-600")} />
        )}
      </motion.span>
    </motion.button>
  );
}
