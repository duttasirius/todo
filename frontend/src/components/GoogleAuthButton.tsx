import { motion } from "framer-motion";

interface GoogleAuthButtonProps {
  onClick: () => void;
  loading?: boolean;
  label: string;
}

export default function GoogleAuthButton({
  onClick,
  loading = false,
  label,
}: GoogleAuthButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3.5 text-sm font-black text-slate-900 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-sm font-black text-slate-900">
        G
      </span>
      {loading ? "Connecting to Google..." : label}
    </motion.button>
  );
}
