'use client';

import Link from 'next/link';
import { contact, booking } from '@/lib/config/brand';

export function MobileStickyBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gradient fade effect */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      {/* Bar content */}
      <div className="bg-bg/95 backdrop-blur-lg border-t border-gold/20 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
          {/* Call Button */}
          <a
            href={`tel:${contact.phoneClean}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gold/50 text-gold font-medium rounded-lg hover:bg-gold/10 active:bg-gold/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span>Call</span>
          </a>

          {/* Book Button */}
          <Link
            href={booking.primaryUrl || '/book'}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gold text-bg font-medium rounded-lg hover:bg-gold-soft active:bg-gold-dark transition-colors shadow-lg shadow-gold/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>Book Now</span>
          </Link>

          {/* Directions Button */}
          <a
            href={contact.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-3 border border-gold/30 text-ivory/70 rounded-lg hover:bg-gold/10 hover:text-gold active:bg-gold/20 transition-colors"
            aria-label="Get directions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
