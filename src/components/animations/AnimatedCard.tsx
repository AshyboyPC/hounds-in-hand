import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedCard = ({ children, delay = 0, className = '' }: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const AnimatedCardWithTilt = ({ children, delay = 0, className = '' }: AnimatedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateX: 10 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ 
      y: -10, 
      rotateX: -2,
      scale: 1.03,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }}
    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    className={className}
  >
    {children}
  </motion.div>
);
