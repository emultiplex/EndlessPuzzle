export default function PauseOverlay({ onResume }: { onResume: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-lg text-center text-white w-72">
        <h2 className="text-xl font-bold mb-4">Paused</h2>

        <button onClick={onResume} className="w-full bg-blue-600 py-3 rounded">
          Resume
        </button>
      </div>
    </div>
  );
}
