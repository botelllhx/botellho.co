import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
  splitBy?: "words" | "chars";
}

const AnimatedText = ({ 
  children, 
  className = "", 
  delay = 0,
  splitBy = "words" 
}: AnimatedTextProps) => {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });

  const items = splitBy === "words" 
    ? children.split(" ") 
    : children.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: splitBy === "words" ? 0.08 : 0.02,
        delayChildren: delay,
      },
    },
  };

  const item = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      style={{ perspective: 1000 }}
    >
      {items.map((word, index) => (
        <motion.span
          key={index}
          variants={item}
          className="inline-block"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word}
          {splitBy === "words" && index !== items.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
