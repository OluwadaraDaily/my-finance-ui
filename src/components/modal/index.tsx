"use client";

import { X } from "lucide-react";

export default function Modal({
  children,
  title,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  // Close modal when clicking outside
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
      onClick={handleClickOutside}
    >
      <div className="w-[90%] mx-auto bg-white rounded-lg py-6">
        <div className="w-[90%] mx-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-semibold">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full border-2 border-grey-500 hover:bg-grey-900 hover:text-white transition-all duration-300"
            >
              <X className="w-4 h-4 text-grey-500 font-bold"/>
            </button>
          </div>
          {/* Modal Content */}
          {children}
        </div>
      </div>
    </div>
  )
}