import { createContext, ReactNode, useContext, useState } from "react";

const DemoDataContext = createContext<{ demoMode: boolean; loadDemoData: () => void; clearDemoData: () => void } | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState(false);
  return <DemoDataContext.Provider value={{ demoMode, loadDemoData: () => setDemoMode(true), clearDemoData: () => setDemoMode(false) }}>{children}</DemoDataContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) throw new Error("useDemoData must be used inside DemoDataProvider");
  return context;
}
