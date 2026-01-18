'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '@/types/database';

interface ServiceCategory {
  category: string;
  services: Service[];
}

interface ServicesAccordionProps {
  categories: ServiceCategory[];
  defaultOpenFirst?: boolean;
}

function formatPrice(priceCents: number): string {
  return `$${Math.round(priceCents / 100)}`;
}

function ServiceList({ services }: { services: Service[] }) {
  return (
    <ul className="space-y-0 border-t border-ink/10">
      {services.map((service, idx) => (
        <li
          key={service.id}
          className={`flex justify-between items-baseline py-3 ${
            idx < services.length - 1 ? 'border-b border-ink/5' : ''
          }`}
        >
          <div className="flex-1 pr-4">
            <span className="text-ink/80 text-body-md font-body">
              {service.name}
            </span>
            {service.description && (
              <p className="text-ink/40 text-body-sm font-body mt-0.5">
                {service.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-ink font-medium text-body-md whitespace-nowrap">
              {formatPrice(service.price_cents)}
            </span>
            <p className="text-ink/40 text-body-sm font-body">
              {service.duration_minutes} min
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CategoryAccordion({
  category,
  services,
  index,
  defaultOpen = false
}: {
  category: string;
  services: Service[];
  index: number;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <article className="border-b border-ink/10 last:border-b-0">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 md:py-8 flex items-center justify-between text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-baseline gap-4 md:gap-6">
          {/* Category Number */}
          <span className="font-display text-2xl md:text-3xl text-ink/20 leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          {/* Category Name */}
          <div>
            <h3 className="font-display text-xl md:text-2xl text-ink leading-tight group-hover:text-botanical transition-colors duration-300">
              {category}
            </h3>
            <p className="text-ink/40 text-body-sm font-body mt-1">
              {services.length} service{services.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <motion.span
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border border-ink/20 flex items-center justify-center group-hover:border-botanical group-hover:text-botanical transition-colors duration-300"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </motion.span>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 md:pb-12 pl-10 md:pl-16">
              <ServiceList services={services} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function ServicesAccordion({ categories, defaultOpenFirst = true }: ServicesAccordionProps) {
  return (
    <div className="divide-y divide-ink/10 border-t border-ink/10">
      {categories.map((cat, index) => (
        <CategoryAccordion
          key={cat.category}
          category={cat.category}
          services={cat.services}
          index={index}
          defaultOpen={defaultOpenFirst && index === 0}
        />
      ))}
    </div>
  );
}
