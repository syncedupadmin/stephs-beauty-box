'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  id: number;
  name: string;
  service: string;
  text: string;
  rating: number;
  image?: string;
}

// Placeholder testimonials until client provides real ones
const placeholderTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Maria G.',
    service: 'Lash Extensions',
    text: 'Absolutely stunning work! Steph took her time to understand exactly what I wanted. My lashes look natural yet glamorous. Will definitely be back!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Jasmine T.',
    service: 'Bridal Makeup',
    text: 'Steph made me feel like a princess on my wedding day. Her attention to detail is incredible, and the makeup lasted all night through tears of joy!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ashley R.',
    service: 'Silk Press',
    text: 'Best silk press I\'ve ever had! My hair was so silky and bouncy. Steph really knows how to work with natural hair. Highly recommend!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Tiffany M.',
    service: 'Brow Lamination',
    text: 'I\'m obsessed with my brows! Finally achieved that fluffy brow look I\'ve been wanting. The studio has such a relaxing vibe too.',
    rating: 5,
  },
];

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function TestimonialCarousel({
  testimonials = placeholderTestimonials,
  autoPlay = true,
  interval = 5000,
  className = '',
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, nextSlide]);

  // Swipe handling
  const handleDragEnd = (_: never, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      prevSlide();
    } else if (info.offset.x < -threshold) {
      nextSlide();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const current = testimonials[currentIndex];

  return (
    <div className={`relative ${className}`}>
      {/* Main testimonial card */}
      <div className="relative overflow-hidden min-h-[300px] md:min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <div className="h-full flex flex-col items-center justify-center text-center px-4 md:px-12">
              {/* Quote mark */}
              <div className="text-gold/20 text-6xl md:text-8xl font-serif leading-none mb-4">
                &ldquo;
              </div>

              {/* Testimonial text */}
              <p className="text-ivory/90 text-lg md:text-xl leading-relaxed max-w-2xl mb-6">
                {current.text}
              </p>

              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.svg
                    key={i}
                    className={`w-5 h-5 ${i < current.rating ? 'text-gold' : 'text-ivory/20'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              {/* Author info */}
              <div className="flex flex-col items-center">
                {current.image && (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-rose/20 mb-3 overflow-hidden">
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="font-medium text-ivory">{current.name}</p>
                <p className="text-sm text-rose">{current.service}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentIndex
                ? 'w-8 bg-gold'
                : 'bg-ivory/20 hover:bg-ivory/40'
              }
            `}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow navigation (desktop) */}
      <div className="hidden md:block">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bg-card/80 backdrop-blur border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/30 transition-all duration-300"
          aria-label="Previous testimonial"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-bg-card/80 backdrop-blur border border-ivory/10 flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/30 transition-all duration-300"
          aria-label="Next testimonial"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Compact testimonial card for grid layouts
export function TestimonialCard({
  testimonial,
  className = '',
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <motion.div
      className={`
        relative p-6 rounded-2xl
        bg-gradient-to-br from-bg-card/80 to-bg-card/40
        backdrop-blur-xl border border-ivory/5
        hover:border-gold/20 transition-all duration-500
        ${className}
      `}
      whileHover={{ y: -4 }}
    >
      {/* Rating */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < testimonial.rating ? 'text-gold' : 'text-ivory/20'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Text */}
      <p className="text-ivory/80 text-sm leading-relaxed mb-4 line-clamp-4">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-rose/20 flex items-center justify-center">
          <span className="text-gold font-medium text-sm">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-ivory font-medium text-sm">{testimonial.name}</p>
          <p className="text-rose text-xs">{testimonial.service}</p>
        </div>
      </div>
    </motion.div>
  );
}
