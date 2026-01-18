'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceCategory, Service, ServiceSubCategory } from '@/lib/config/services-data';

interface ServiceAccordionProps {
  category: ServiceCategory;
  index: number;
  defaultOpen?: boolean;
}

function formatPrice(price: number, priceNote?: string): string {
  if (priceNote) {
    // Handle range notes like "–$195" or "–$220+"
    if (priceNote.startsWith('–')) {
      return `$${price}${priceNote}`;
    }
    // Handle other notes like "+", "per row", "each"
    return `$${price}${priceNote}`;
  }
  return `$${price}`;
}

function ServiceList({ services, showBorder = true }: { services: Service[]; showBorder?: boolean }) {
  return (
    <ul className={`space-y-0 ${showBorder ? 'border-t border-ink/10' : ''}`}>
      {services.map((service, idx) => (
        <li
          key={service.name}
          className={`flex justify-between items-baseline py-3 ${
            idx < services.length - 1 ? 'border-b border-ink/5' : ''
          }`}
        >
          <span className="text-ink/80 text-body-md font-body pr-4">
            {service.name}
          </span>
          <span className="text-ink font-medium text-body-md whitespace-nowrap">
            {formatPrice(service.price, service.priceNote)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SubCategorySection({ subCategory }: { subCategory: ServiceSubCategory }) {
  return (
    <div className="mb-8 last:mb-0">
      <h4 className="font-display text-lg text-ink/90 mb-4 tracking-wide">
        {subCategory.name}
      </h4>
      <ServiceList services={subCategory.services} showBorder={false} />
    </div>
  );
}

export function ServiceAccordion({ category, index, defaultOpen = false }: ServiceAccordionProps) {
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
          {/* Service Number */}
          <span className="font-display text-2xl md:text-3xl text-ink/20 leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          {/* Category Name */}
          <h3 className="font-display text-xl md:text-2xl text-ink leading-tight group-hover:text-botanical transition-colors duration-300">
            {category.name}
          </h3>
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
              {/* Services without subcategories */}
              {category.services && category.services.length > 0 && (
                <ServiceList services={category.services} />
              )}

              {/* Services with subcategories */}
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="space-y-8">
                  {category.subCategories.map((subCategory) => (
                    <SubCategorySection key={subCategory.name} subCategory={subCategory} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

// Export a container for multiple accordions
interface ServiceAccordionGroupProps {
  categories: ServiceCategory[];
  defaultOpenFirst?: boolean;
}

export function ServiceAccordionGroup({ categories, defaultOpenFirst = true }: ServiceAccordionGroupProps) {
  return (
    <div className="divide-y divide-ink/10 border-t border-ink/10">
      {categories.map((category, index) => (
        <ServiceAccordion
          key={category.id}
          category={category}
          index={index}
          defaultOpen={defaultOpenFirst && index === 0}
        />
      ))}
    </div>
  );
}
