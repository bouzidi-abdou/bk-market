"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function OfferCountdown() {
  const [left, setLeft] = useState(24 * 3600);

  useEffect(() => {
    const id = setInterval(
      () => setLeft((s) => (s <= 1 ? 24 * 3600 : s - 1)),
      1000
    );
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3">
      <span className="flex items-center gap-2 text-xs font-black text-rose-500">
        <Timer className="size-4 animate-pulse-soft" />
        ينتهي عرض الخصم خلال
      </span>
      <span
        dir="ltr"
        className="font-display text-sm font-bold tabular-nums tracking-widest text-rose-500"
      >
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}
