import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { XCircle } from "lucide-react";

export type ActionConfirmationVariant = "danger" | "primary" | "warning";

export interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ActionConfirmationVariant;
  icon?: React.ReactNode;
  onConfirm?: () => void;
  className?: string;
}

export function ActionConfirmationModal({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  icon,
  onConfirm,
  className = "",
}: ActionConfirmationModalProps) {
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = useRef(0);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Reset drag on open
  useEffect(() => {
    if (isOpen) {
      setDragOffsetY(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Touch Swipe-Down to Dismiss Handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (dragOffsetY > 70) {
      onClose();
    } else {
      setDragOffsetY(0);
    }
  }, [dragOffsetY, onClose]);

  if (!isOpen) return null;

  const confirmButtonStyles =
    confirmVariant === "danger"
      ? "bg-[#B91C1C] hover:bg-[#991B1B] text-white"
      : confirmVariant === "warning"
      ? "bg-amber-600 hover:bg-amber-700 text-white"
      : "bg-[#0E172A] hover:bg-black text-white";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* ── Background Blur Backdrop (Tap to Close) ──────────── */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* ── Bottom Sheet Container ────────────────────────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: dragOffsetY > 0 ? `translateY(${dragOffsetY}px)` : undefined,
          transition: isDragging
            ? "none"
            : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`
          relative z-10 w-full max-w-md mx-auto bg-white rounded-t-3xl px-6 pt-3 pb-8 shadow-2xl
          flex flex-col items-center text-center space-y-4 select-none
          animate-in slide-in-from-bottom duration-300
          ${className}
        `.trim()}
        role="dialog"
        aria-modal="true"
      >
        {/* Pull / Drag Handle Bar */}
        <div className="w-10 h-1 rounded-full bg-slate-300 shrink-0 cursor-grab mb-2" />

        {/* Top Icon Slot */}
        {icon !== undefined ? (
          icon
        ) : (
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center shrink-0 text-rose-500">
            <XCircle className="w-7 h-7" />
          </div>
        )}

        {/* Title & Description */}
        <div className="space-y-1.5 px-2">
          <h3 className="text-[19px] font-bold text-[#0E172A] leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[13.5px] text-[#62718A] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2.5 pt-2">
          <button
            type="button"
            onClick={onConfirm}
            className={`
              w-full h-12 font-semibold text-[15px] rounded-2xl flex items-center justify-center transition-all cursor-pointer active:scale-[0.99] shadow-sm
              ${confirmButtonStyles}
            `.trim()}
          >
            {confirmLabel}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full h-12 font-semibold text-[15px] rounded-2xl bg-[#F1F3F6] hover:bg-slate-200 text-[#0E172A] transition-all cursor-pointer active:scale-[0.99]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ActionConfirmationModal;