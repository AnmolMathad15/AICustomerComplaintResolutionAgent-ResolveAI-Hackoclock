import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useListCompanies } from "@workspace/api-client-react";
import type { Company } from "@workspace/api-client-react";

type CompanyContextValue = {
  companies: Company[];
  selectedCompanyId: string | "all";
  selectedCompany: Company | undefined;
  setSelectedCompanyId: (id: string | "all") => void;
  isLoading: boolean;
};

const CompanyContext = createContext<CompanyContextValue | undefined>(undefined);

const STORAGE_KEY = "resolveai.selectedCompany";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { data: companies = [], isLoading } = useListCompanies();
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<string | "all">(() => {
    if (typeof window === "undefined") return "all";
    return (localStorage.getItem(STORAGE_KEY) as string) || "all";
  });

  const setSelectedCompanyId = useCallback((id: string | "all") => {
    setSelectedCompanyIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  // Once companies load, ensure stored id is still valid
  useEffect(() => {
    if (!companies.length) return;
    if (selectedCompanyId !== "all" && !companies.find((c) => c.id === selectedCompanyId)) {
      setSelectedCompanyId("all");
    }
  }, [companies, selectedCompanyId, setSelectedCompanyId]);

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId),
    [companies, selectedCompanyId]
  );

  const value = useMemo(
    () => ({
      companies,
      selectedCompanyId,
      selectedCompany,
      setSelectedCompanyId,
      isLoading,
    }),
    [companies, selectedCompanyId, selectedCompany, setSelectedCompanyId, isLoading]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}
