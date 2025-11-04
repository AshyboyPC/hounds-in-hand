'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeIn, scaleIn, textVariants, cardVariants } from '@/lib/animations';

type AnimatedProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  type?: 'fade' | 'scale' | 'text' | 'card';
  viewport?: { once?: boolean; margin?: string };
};

export const Animated = ({
  children,
  className,
  delay = 0,
  direction = 'up',
  type = 'fade',
  viewport = { once: true, margin: '-50px' },
  ...props
}: AnimatedProps) => {
  const variants = {
    fade: fadeIn(direction, delay),
    scale: scaleIn(0.95, delay),
    text: textVariants,
    card: cardVariants,
  }[type];

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedList = ({
  children,
  className,
  staggerChildren = 0.1,
  delayChildren = 0.1,
  viewport = { once: true, margin: '-50px' },
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  viewport?: { once?: boolean; margin?: string };
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
