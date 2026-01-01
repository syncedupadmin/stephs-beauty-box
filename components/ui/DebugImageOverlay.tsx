'use client';

/**
 * DEBUG IMAGE OVERLAY
 * ====================
 * Shows image index badges in development mode when NEXT_PUBLIC_DEBUG_IMAGES=true
 * Helps verify all image slots are properly filled and looping works correctly.
 */

interface DebugImageOverlayProps {
  imageIndex: number;
  children: React.ReactNode;
  className?: string;
}

export function DebugImageOverlay({ imageIndex, children, className = '' }: DebugImageOverlayProps) {
  const showDebug = process.env.NEXT_PUBLIC_DEBUG_IMAGES === 'true';

  return (
    <div className={`relative ${className}`}>
      {children}
      {showDebug && (
        <div className="absolute top-2 left-2 z-50 bg-black/80 text-white text-xs font-mono px-2 py-1 rounded">
          #{String(imageIndex).padStart(2, '0')}
        </div>
      )}
    </div>
  );
}

/**
 * Helper to extract image index from path
 * @param imagePath - Path like '/images/gallery/gallery-05.png'
 * @returns Index number (e.g., 5)
 */
export function getImageIndexFromPath(imagePath: string): number {
  const match = imagePath.match(/gallery-(\d+)\./);
  return match ? parseInt(match[1], 10) : 0;
}
