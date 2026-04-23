import { useState, useRef, useEffect } from "react";
import { ChevronDown, Building2, Check } from "lucide-react";
import { useCompany } from "@/lib/company-context";
import { cn } from "@/lib/utils";

export function CompanySwitcher() {
  const { companies, selectedCompanyId, selectedCompany, setSelectedCompanyId } = useCompany();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const label = selectedCompany?.name ?? "All Companies";
  const accent = selectedCompany?.color ?? "#f97316";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-9 px-3 rounded-full glass border border-white/10 hover:border-orange-500/30 transition-all text-sm"
        data-testid="company-switcher"
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
        <Building2 className="w-3.5 h-3.5 text-foreground/60" />
        <span className="font-medium hidden sm:inline">{label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-foreground/60" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-56 rounded-xl glass-strong border border-white/10 p-1 shadow-2xl z-50 fade-in-up">
          <button
            onClick={() => {
              setSelectedCompanyId("all");
              setOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors",
              selectedCompanyId === "all" && "bg-orange-500/10 text-orange-300"
            )}
            data-testid="company-option-all"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-500 to-pink-500" />
              All Companies
            </div>
            {selectedCompanyId === "all" && <Check className="w-4 h-4" />}
          </button>
          <div className="h-px bg-white/8 my-1" />
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCompanyId(c.id);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors",
                selectedCompanyId === c.id && "bg-orange-500/10 text-orange-300"
              )}
              data-testid={`company-option-${c.id}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                />
                <div className="flex flex-col items-start leading-tight min-w-0">
                  <span className="font-medium truncate">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground">{c.industry}</span>
                </div>
              </div>
              {selectedCompanyId === c.id && <Check className="w-4 h-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
