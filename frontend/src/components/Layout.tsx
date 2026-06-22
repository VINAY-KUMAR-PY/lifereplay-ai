import { BrainCircuit, Gauge, GitCompare, GraduationCap, History, Home, Menu, ScanSearch, Telescope, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/analyze", label: "Analyze", icon: BrainCircuit },
  { href: "/career-replay", label: "CareerReplay", icon: GraduationCap },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/future-simulation", label: "Future Simulation", icon: Telescope },
  { href: "/recruiter-view", label: "Recruiter View", icon: ScanSearch },
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/history", label: "History", icon: History }
];

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
              <BrainCircuit size={22} />
            </span>
            <span>
              <span className="block text-base font-bold leading-tight">LifeReplay AI</span>
              <span className="text-xs font-medium text-slate-500">Career intelligence system</span>
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 xl:flex">
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

          <button
            type="button"
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 xl:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 xl:hidden">
            <div className="grid gap-2">
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
    </div>
  );
}
