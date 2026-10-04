import React from 'react';
import { motion } from 'framer-motion';
import { productsData } from '../../products/services/productsData';
import { fadeUp, staggerContainer } from '../../../animations/variants';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface CategoryNavSectionProps {
  onNavigateCategory: (id: string, name: string) => void;
}

export const CategoryNavSection: React.FC<CategoryNavSectionProps> = ({ onNavigateCategory }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-[#D8C5A8] font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#C99A2E] font-bold">DISCOVER STYLE</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3B2A1A] mt-1">
            Category Navigation
          </h2>
        </div>
      </div>

      <motion.div 
        variants={prefersReducedMotion ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4 sm:gap-6 justify-items-center"
      >
        {productsData.categories.map(cat => (
          <motion.div
            key={cat.id}
            variants={prefersReducedMotion ? undefined : fadeUp}
            onClick={() => onNavigateCategory(cat.handle, cat.name)}
            className="group flex flex-col items-center cursor-pointer max-w-[110px] w-full"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FAF4E8] border border-[#D8C5A8] p-1 relative overflow-hidden transition-all duration-300 group-hover:border-[#C99A2E] group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[#3B2A1A]/10">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
            </div>
            <span className="mt-3 text-xs font-semibold text-[#6B5842] group-hover:text-[#C99A2E] transition-colors text-center tracking-tight">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
