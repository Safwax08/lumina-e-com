import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from '../../../components/common/MagneticButton';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface SlideContent {
  tag: string;
  title: string;
  highlight: string;
  subtext: string;
  buttonText: string;
  scriptText: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
}

interface HeroProps {
  slides: SlideContent[];
  onNavigateCategory: (id: string, name: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ slides, onNavigateCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  const imageVariants = {
    initial: { scale: 1.05, opacity: 0.25 },
    animate: {
      scale: 1,
      opacity: 0.4,
      transition: { duration: prefersReducedMotion ? 0.2 : 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: { opacity: 0.1, transition: { duration: 0.4 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const subtextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const ctaVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="relative bg-[#F3E6D0] min-h-[580px] sm:min-h-[660px] flex items-center border-b border-[#D8C5A8] overflow-hidden font-sans">
      
      {/* Background photo & Warm Beige overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={activeSlide.imageUrl}
            alt={activeSlide.title}
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F3E6D0] via-[#F3E6D0]/85 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F3E6D0] via-transparent to-transparent z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Hero Left Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl text-left space-y-6"
          >
            
            <motion.div variants={tagVariants} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF4E8] border border-[#D8C5A8] text-[#C99A2E] text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C99A2E] animate-ping" />
              <span>{activeSlide.tag}</span>
            </motion.div>

            <motion.h1 variants={headingVariants} className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-[#3B2A1A] tracking-tight leading-[1.05]">
              {activeSlide.title}<br />
              <span className="text-[#C99A2E]">
                {activeSlide.highlight}
              </span>
            </motion.h1>

            <motion.p variants={subtextVariants} className="text-sm sm:text-base text-[#6B5842] max-w-lg font-light leading-relaxed">
              {activeSlide.subtext}
            </motion.p>

            <motion.div variants={ctaVariants} className="pt-2 flex flex-wrap items-center gap-4">
              <MagneticButton
                onClick={() => onNavigateCategory(activeSlide.categoryId, activeSlide.categoryName)}
                className="px-8 py-4 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl hover:shadow-[#C99A2E]/20 flex items-center gap-2 group"
                ariaLabel={activeSlide.buttonText}
              >
                <span>{activeSlide.buttonText}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </MagneticButton>
            </motion.div>

          </motion.div>
        </AnimatePresence>

        {/* Right overlay script callout */}
        <div className="hidden md:flex flex-col items-end text-right z-20">
          <p className="font-script text-4xl lg:text-5xl text-[#A87918] -rotate-6 transform drop-shadow-md">
            "{activeSlide.scriptText}"
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-[#C99A2E] mt-2" />
        </div>

      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-30 flex items-center gap-6 bg-[#FAF4E8]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#D8C5A8]">
        <div className="flex items-center gap-2 text-xs font-mono text-[#6B5842]">
          <span className="text-[#C99A2E] font-bold">0{currentSlide + 1}</span>
          <span className="text-[#6B5842]">/</span>
          <span className="text-[#6B5842]">03</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="w-7 h-7 rounded-full bg-[#FFFDF8] hover:bg-[#C99A2E] hover:text-[#FFFDF8] text-[#3B2A1A] flex items-center justify-center transition-colors shadow-sm"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="w-7 h-7 rounded-full bg-[#FFFDF8] hover:bg-[#C99A2E] hover:text-[#FFFDF8] text-[#3B2A1A] flex items-center justify-center transition-colors shadow-sm"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </div>

    </section>
  );
};
