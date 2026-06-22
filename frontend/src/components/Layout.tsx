import { BrainCircuit, Database, Gauge, GitCompare, GraduationCap, History, Home, Menu, Moon, ScanSearch, Sun, Telescope, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDemoData } from "../context/DemoDataContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/analyze", label: "Analyze", icon: BrainCircuit },
  { href: "/career-replay", label: "CareerReplay", icon: GraduationCap },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/future-simulation", label: "Career Battle", icon: Telescope },
  { href: "/recruiter-view", label: "Recruiter View", icon: ScanSearch },
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/history", label: "History", icon: History }
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { demoMode, loadDemoData, clearDemoData } = useDemoData();

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
              <BrainCircuit size={22} />
            </span>
            <span>
              <span className="block text-base font-bold leading-tight">LifeReplay AI</span>
              <span className="text-xs font-medium text-slate-500">Career intelligence system</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 2xl:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={demoMode ? clearDemoData : loadDemoData} className={`hidden min-h-10 items-center gap-2 rounded-md border px-3 text-xs font-black transition sm:inline-flex ${demoMode ? "border-teal-300 bg-teal-50 text-teal-800" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><Database size={15} />{demoMode ? "Demo Data Active" : "Load Demo Data"}</button>
            <button type="button" onClick={toggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"} className="grid h-10 w-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button type="button" aria-label="Toggle menu" className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 2xl:hidden" onClick={() => setOpen((value) => !value)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 2xl:hidden">
            <div className="grid gap-2">
              <button type="button" onClick={() => { demoMode ? clearDemoData() : loadDemoData(); setOpen(false); }} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold sm:hidden ${demoMode ? "bg-teal-50 text-teal-800" : "text-slate-600"}`}><Database size={16} />{demoMode ? "Clear Demo Data" : "Load Demo Data"}</button>
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                      isActive ? "bg-slate-950 text-white" : "text-slate-600"
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p className="font-bold text-slate-700 dark:text-slate-200">LifeReplay AI — Career Decision Intelligence Platform</p><p>AI-calibrated insights with transparent mock fallback.</p></div></footer>
    </div>
  );
}
