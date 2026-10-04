import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface CollectionBannersSectionProps {
  onNavigateCategory: (id: string, name: string) => void;
}

export const CollectionBannersSection: React.FC<CollectionBannersSectionProps> = ({ onNavigateCategory }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#D8C5A8] font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Banner: Casual Collection */}
        <motion.div 
          variants={prefersReducedMotion ? undefined : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          onClick={() => onNavigateCategory('cat-tshirts', 'Casual Collection')}
          className="group relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end p-8 sm:p-10 border border-[#D8C5A8] cursor-pointer bg-[#FAF4E8]"
        >
          <img
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80"
            alt="Casual Collection"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3E6D0] via-[#F3E6D0]/80 to-transparent z-10" />

          <div className="relative z-20 space-y-2 text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C99A2E] font-bold">
              THE ESSENTIALS
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#3B2A1A]">
              Casual Collection
            </h3>
            <p className="text-xs text-[#6B5842] font-light max-w-xs pb-3">
              Everyday style, elevated with premium fabrics.
            </p>
            <button className="px-5 py-2.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-md">
              <span>Explore Now</span>
              <span>→</span>
            </button>
          </div>
        </motion.div>

        {/* Right Banner: Formal Collection */}
        <motion.div 
          variants={prefersReducedMotion ? undefined : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          onClick={() => onNavigateCategory('cat-suits', 'Formal Collection')}
          className="group relative rounded-2xl overflow-hidden min-h-[380px] flex flex-col justify-end p-8 sm:p-10 border border-[#D8C5A8] cursor-pointer bg-[#FAF4E8]"
        >
          <img
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
            alt="Formal Collection"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F3E6D0] via-[#F3E6D0]/80 to-transparent z-10" />

          <div className="relative z-20 space-y-2 text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C99A2E] font-bold">
              FOR SPECIAL MOMENTS
            </span>
            <h3 className="text-3xl font-serif font-bold text-[#3B2A1A]">
              Formal Collection
            </h3>
            <p className="text-xs text-[#6B5842] font-light max-w-xs pb-3">
              Sharp looks for bigger goals and boardroom presence.
            </p>
            <button className="px-5 py-2.5 bg-[#C99A2E] hover:bg-[#A87918] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-md">
              <span>Explore Now</span>
              <span>→</span>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
