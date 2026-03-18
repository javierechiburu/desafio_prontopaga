import type { ReactNode } from "react";
import { ShellIcon } from "./ShellIcon";

interface AppShellProps {
  children: ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  actionLabel: string;
  onActionClick: () => void;
  actionLoading?: boolean;
}

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Panel",
    icon: "dashboard" as const,
    active: false,
  },
  {
    id: "transactions",
    label: "Transacciones",
    icon: "transactions" as const,
    active: true,
  },
  {
    id: "accounts",
    label: "Cuentas",
    icon: "accounts" as const,
    active: false,
  },
  {
    id: "settings",
    label: "Configuracion",
    icon: "settings" as const,
    active: false,
  },
];

export function AppShell({
  children,
  searchValue,
  onSearchChange,
  actionLabel,
  onActionClick,
  actionLoading = false,
}: AppShellProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <aside className="border-b border-white/70 bg-white/75 px-4 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:min-h-screen lg:border-b-0 lg:border-r lg:border-slate-200/70 lg:px-5 lg:py-7">
        <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/70 bg-white/85 px-4 py-3 shadow-soft">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-brand-100 to-rose-100 text-sm font-black text-brand-700">
            JE
          </div>
          <div>
            <strong className="block text-sm font-bold text-ink-950">
              Javier Echiburu
            </strong>
            <span className="text-xs text-ink-500">Estado elite</span>
          </div>
        </div>

        <nav
          className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1"
          aria-label="Navegacion principal"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                item.active
                  ? "bg-linear-to-r from-brand-50 via-white to-white text-brand-700 ring-1 ring-brand-200"
                  : "bg-white/60 text-ink-500 hover:bg-white/90 hover:text-ink-950"
              }`}
              href="#"
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                  item.active
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600"
                }`}
              >
                <ShellIcon name={item.icon} className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 px-3 pt-3 lg:px-5 lg:pt-5">
          <div className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/80 px-4 py-4 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between lg:px-6">
            <label className="relative flex w-full max-w-xl items-center">
              <ShellIcon
                name="search"
                className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400"
              />
              <input
                className="h-12 w-full rounded-full border border-slate-200/80 bg-slate-50/80 pl-11 pr-4 text-sm text-ink-950 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
                type="search"
                placeholder="Buscar transacciones..."
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </label>

            <div className="flex items-center justify-between gap-2 md:justify-end">
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                  type="button"
                  aria-label="Notificaciones"
                >
                  <ShellIcon name="bell" className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                  type="button"
                  aria-label="Ayuda"
                >
                  <ShellIcon name="help" className="h-4 w-4" />
                </button>
              </div>

              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-linear-to-r from-brand-600 to-brand-500 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:-translate-y-0.5 hover:shadow-brand-300"
                onClick={onActionClick}
                type="button"
              >
                <ShellIcon name="download" className="h-4 w-4" />
                <span>{actionLoading ? "Exportando..." : actionLabel}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full flex-1 px-3 pb-8 pt-5 lg:px-5 lg:pb-10 lg:pt-6">
          {children}
        </div>

        <footer className="px-4 pb-7 text-center text-[10px] font-extrabold tracking-[0.32em] text-slate-400">
          SERVICIOS VIP DE BANCA PRIVADA (C) 2026
        </footer>
      </div>
    </div>
  );
}
