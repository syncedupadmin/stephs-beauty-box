'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { brand, contact } from '@/lib/config/brand';
import { getImage } from '@/lib/config/images';

/**
 * COMING SOON PAGE - IMMERSIVE LUXURY EXPERIENCE
 * ==============================================
 * Full-screen takeover with no navigation
 * Crossfading gallery images, elegant animations
 * Password bypass for authorized preview
 */

// Curated images for the slideshow
const SLIDESHOW_IMAGES = [
  getImage(7),   // Beautiful portrait
  getImage(8),   // Stunning look
  getImage(12),  // Gorgeous styling
  getImage(15),  // Elegant beauty
  getImage(17),  // Radiant
];

// Preview password (client-side check, cookie set for middleware)
const PREVIEW_PASSWORD = 'StephBB123!!';

export default function ComingSoonPage() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  // Image slideshow
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    if (password === PREVIEW_PASSWORD) {
      // Set cookie for 7 days
      document.cookie = `site_preview=authorized; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      // Redirect to home
      router.push('/');
    } else {
      setError('Incorrect password');
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal overflow-hidden z-[100]">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={SLIDESHOW_IMAGES[currentImageIndex]}
              alt="Steph's Beauty Box"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Elegant overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/60 to-charcoal/90" />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(22,21,20,0.4)_100%)]" />
      </div>

      {/* Floating Particles/Shimmer Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-off-white/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
            }}
            animate={{
              y: -10,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Brand Mark - Animated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <span className="font-display text-6xl md:text-8xl text-off-white/10 tracking-tight">
            SB
          </span>
        </motion.div>

        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="overline text-off-white/50 mb-6 tracking-[0.4em] text-center"
        >
          Something Beautiful Awaits
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-off-white text-center leading-[0.85] tracking-tight mb-6"
        >
          Coming
          <br />
          <span className="font-editorial-italic text-botanical">Soon</span>
        </motion.h1>

        {/* Brand Name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="font-display text-xl md:text-2xl text-off-white/70 mb-8 text-center"
        >
          {brand.name}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="text-off-white/50 text-body-md md:text-body-lg max-w-md text-center font-body leading-relaxed mb-12"
        >
          We&apos;re crafting a sanctuary where beauty meets belonging.
          A space for everyone to feel seen, celebrated, and stunning.
        </motion.p>

        {/* Elegant Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-off-white/30 to-transparent mb-12"
        />

        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Phone */}
          <a
            href={`tel:${contact.phoneClean}`}
            className="group flex items-center gap-3 text-off-white hover:text-botanical transition-colors duration-500"
          >
            <svg className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="font-display text-lg">{contact.phoneFormatted}</span>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/stephsbeautybox_/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-off-white/70 hover:text-off-white transition-colors duration-500"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-body text-body-md">@stephsbeautybox_</span>
          </a>

          {/* Location */}
          <p className="text-off-white/30 text-body-sm font-body flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            West Park, FL
          </p>
        </motion.div>

        {/* Preview Access Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          onClick={() => setShowPasswordModal(true)}
          className="mt-12 text-off-white/30 text-body-sm font-body hover:text-off-white/60 transition-colors duration-500 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Preview Access
        </motion.button>

        {/* Faith Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-8 left-0 right-0 text-center font-display italic text-off-white/20 text-sm px-6"
        >
          {brand.faithMessage}
        </motion.p>
      </div>

      {/* Slideshow Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDESHOW_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentImageIndex
                ? 'bg-off-white/80 w-6'
                : 'bg-off-white/30 hover:bg-off-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-off-white/10 z-20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-off-white/10 z-20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-off-white/10 hidden md:block z-20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-off-white/10 hidden md:block z-20" />

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-charcoal border border-off-white/10 p-8 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-display text-2xl text-off-white mb-2 text-center">
                Preview Access
              </h2>
              <p className="text-off-white/50 text-body-sm font-body mb-6 text-center">
                Enter the password to preview the site
              </p>

              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                  className="w-full bg-off-white/5 border border-off-white/20 px-4 py-3 text-off-white placeholder:text-off-white/30 font-body text-body-md focus:outline-none focus:border-botanical transition-colors duration-300 mb-4"
                />

                {error && (
                  <p className="text-red-400 text-body-sm font-body mb-4 text-center">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isChecking || !password}
                  className="w-full bg-botanical text-off-white py-3 font-display text-lg hover:bg-botanical/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? 'Checking...' : 'Enter Site'}
                </button>
              </form>

              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-full mt-4 text-off-white/40 text-body-sm font-body hover:text-off-white/60 transition-colors duration-300"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
