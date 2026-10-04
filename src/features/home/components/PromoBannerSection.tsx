import React from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from '../../../components/common/MagneticButton';
import { fadeUp } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface PromoBannerSectionProps {
  onNavigateSale: () => void;
}

export const PromoBannerSection: React.FC<PromoBannerSectionProps> = ({ onNavigateSale }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[#FAF4E8] border-b border-[#D8C5A8] overflow-hidden py-20 my-8 font-sans">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1400&q=80"
          alt="Promotional Banner"
          loading="lazy"
          className="w-full h-full object-cover opacity-30 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF4E8] via-[#FAF4E8]/90 to-transparent z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col md:flex-row items-center justify-between gap-10">
        
        <motion.div 
          variants={prefersReducedMotion ? undefined : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-xl text-left space-y-4"
        >
          <span className="px-3.5 py-1 bg-[#C99A2E]/15 text-[#C99A2E] border border-[#D8C5A8] text-[10px] font-mono uppercase tracking-widest rounded-full">
            LIMITED TIME OFFER
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#3B2A1A] leading-tight">
            FLAT 30% OFF<br />
            <span className="text-[#C99A2E]">On Selected Styles</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5842] font-light">
            Upgrade your wardrobe with tailored blazers, raw indigo denim, and classic linen shirts.
          </p>
          
          <div className="pt-2">
            <MagneticButton
              onClick={onNavigateSale}
              className="px-8 py-3.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xl hover:shadow-[#C99A2E]/20 flex items-center gap-2"
              ariaLabel="Shop the Sale"
            >
              <span>Shop the Sale</span>
              <span>→</span>
            </MagneticButton>
          </div>
        </motion.div>

        <div className="hidden md:block text-right border-l border-[#D8C5A8] pl-8">
          <h3 className="text-2xl lg:text-3xl font-serif font-extrabold text-[#3B2A1A] uppercase tracking-widest leading-snug">
            DRESS BOLDER<br />
            <span className="text-[#6B5842] font-light">LIVE BIGGER</span>
          </h3>
        </div>

      </div>
    </section>
  );
};
