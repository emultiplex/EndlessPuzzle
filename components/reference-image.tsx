"use client";

export default function ReferenceImage({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-lg p-4 max-w-sm w-full text-white">
        <h3 className="text-sm font-semibold mb-2 text-center">
          Reference Image
        </h3>

        <img
          src={image}
          alt="Reference"
          className="w-full h-auto rounded border border-gray-700 mb-4"
          draggable={false}
        />

        <button onClick={onClose} className="w-full bg-blue-600 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
