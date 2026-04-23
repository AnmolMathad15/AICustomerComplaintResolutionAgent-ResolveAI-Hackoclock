import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  /** Truncation length in characters. Defaults to 120 per spec. */
  threshold?: number;
  className?: string;
  showLessLabel?: string;
  showMoreLabel?: string;
}

/**
 * Non-breaking truncation toggle. If text is shorter than threshold,
 * renders as a normal <p>. If longer, shows truncated form with a
 * "View Full / Show Less" toggle. Layout-stable (no jump-cut on toggle).
 */
export function ExpandableText({
  text,
  threshold = 120,
  className,
  showLessLabel = "Show Less",
  showMoreLabel = "View Full",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (text?.length ?? 0) > threshold;

  if (!isLong) {
    return <p className={cn("text-sm leading-relaxed", className)}>{text}</p>;
  }

  const preview = text.slice(0, threshold).trimEnd() + "…";

  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-sm leading-relaxed transition-all">
        {expanded ? text : preview}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-400 hover:text-orange-300 transition-colors"
        data-testid="expandable-toggle"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-3 h-3" />
            {showLessLabel}
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3" />
            {showMoreLabel}
          </>
        )}
      </button>
    </div>
  );
}
