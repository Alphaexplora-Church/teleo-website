import { useState } from "react";
import { WifiOff, RotateCcw } from "lucide-react";
import { Button } from "../../../../shared/components/Button/Button";
import type { ButtonVariant } from "../../../../shared/components/Button/button.style";

export interface NetworkErrorStateProps {
  /** Error title heading (default: "No Internet Connection") */
  title?: string;
  /** Explanatory message below title (default: "Please check your network settings and try again.") */
  message?: string;
  /** Label for the action button (default: "Try Again") */
  retryLabel?: string;
  /** Callback fired when user clicks the retry button */
  onRetry?: () => void | Promise<void>;
  /** Optional controlled retrying/loading state */
  isRetrying?: boolean;
  /** Button variant restricted strictly to available Button variants (default: "primary") */
  buttonVariant?: ButtonVariant;
  /** Optional custom CSS classes for the card container */
  className?: string;
}

/**
 * Reusable full-card or inline error state for network disconnection / API request failures.
 * Matches the design with WifiOff icon badge, descriptive text, and a usable Try Again Button.
 */
export function NetworkErrorState({
  title = "No Internet Connection",
  message = "Please check your network settings and try again.",
  retryLabel = "Try Again",
  onRetry,
  isRetrying: controlledIsRetrying,
  buttonVariant = "primary",
  className = "",
}: NetworkErrorStateProps) {
  const [internalIsRetrying, setInternalIsRetrying] = useState(false);
  const isRetrying = controlledIsRetrying ?? internalIsRetrying;

  const handleRetry = async () => {
    if (isRetrying) return;

    if (!onRetry) {
      // If no custom onRetry callback is provided, simulate a brief retry state
      setInternalIsRetrying(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setInternalIsRetrying(false);
      return;
    }

    try {
      const result = onRetry();
      if (result && typeof result.then === "function") {
        setInternalIsRetrying(true);
        await result;
      }
    } finally {
      setInternalIsRetrying(false);
    }
  };

  return (
    <div
      className={`
        w-full max-w-sm mx-auto bg-white border border-slate-100 rounded-3xl p-8
        flex flex-col items-center justify-center text-center shadow-xs select-none
        ${className}
      `.trim()}
      role="alert"
      aria-live="assertive"
    >
      {/* ── Circular Offline Icon Badge ──────────────────────────── */}
      <div
        className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-700"
        aria-hidden="true"
      >
        <WifiOff className="w-7 h-7 stroke-[1.8]" />
      </div>

      {/* ── Title ────────────────────────────────────────────────── */}
      <h3 className="text-base font-bold text-slate-900 leading-snug">
        {title}
      </h3>

      {/* ── Message ──────────────────────────────────────────────── */}
      <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-[260px] mt-1.5 mb-6">
        {message}
      </p>

      {/* ── Action Button (Using shared Button component) ────────── */}
      <Button
        type="button"
        variant={buttonVariant}
        size="md"
        onClick={handleRetry}
        disabled={isRetrying}
        className="rounded-xl px-5 text-white font-medium shadow-sm transition-all cursor-pointer flex items-center gap-2"
      >
        <RotateCcw
          className={`w-4 h-4 text-white shrink-0 transition-transform ${
            isRetrying ? "animate-spin" : ""
          }`}
          aria-hidden="true"
        />
        <span>{isRetrying ? "Retrying..." : retryLabel}</span>
      </Button>
    </div>
  );
}

export default NetworkErrorState;