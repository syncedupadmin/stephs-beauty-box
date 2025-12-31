/**
 * Global Loading State
 * Shows while page content is loading.
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        <p className="text-ivory/60 text-sm">Loading...</p>
      </div>
    </div>
  );
}
