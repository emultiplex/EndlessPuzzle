"use client";

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md text-white">
        <h2 className="text-xl font-bold mb-3">How to Play</h2>

        <ul className="space-y-2 text-sm">
          <li>🧩 Drag puzzle pieces to the spquar board click/tap to snap</li>
          <li>🎯 Pieces snap when correct</li>
          <li>⏱️ Beat the timer to score higher</li>
          <li>⏸️ Pause anytime</li>
        </ul>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 py-2 rounded"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
