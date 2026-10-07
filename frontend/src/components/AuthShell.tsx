import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(99,102,241,0.24),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.18),transparent_32%)]" />
      <div className="relative mx-auto grid min-h-screen w-[min(1100px,calc(100%-32px))] items-center py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
          <a href="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-black text-slate-950">T</span>
            <span className="text-lg font-black tracking-tight">Todo</span>
          </a>
          <p className="mt-16 text-xs font-black uppercase tracking-[0.28em] text-indigo-300">A quieter task manager</p>
          <h2 className="mt-4 max-w-xl text-5xl font-black leading-[1.02] tracking-[-0.04em]">
            Plan the work.<br />Keep the noise out.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
            A focused workspace for the tasks that actually matter — with priorities, due dates and clean detail pages.
          </p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
            <a href="/" className="text-sm font-bold text-slate-300 lg:hidden">← Todo</a>
            <div className="mt-5 lg:mt-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-indigo-300">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
            </div>
            <div className="mt-7">{children}</div>
            <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-400">{footer}</div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
