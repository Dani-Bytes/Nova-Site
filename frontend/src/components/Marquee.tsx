import { formatCurrency } from "@/lib/currency";

export const Marquee = () => {
  const items = [
    "NEW DROP 07",
    `FREE SHIPPING OVER ${formatCurrency(80)}`,
    "STUDENT 15% OFF",
    "AR TRY-ON",
    "LIMITED EDITION",
    "MADE FOR GEN-Z",
  ];
  const row = [...items, ...items];
  return (
    <div className="relative py-6 border-y border-border/50 bg-gradient-soft overflow-hidden">
      <div className="flex marquee gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <div key={i} className="flex items-center gap-12 font-display font-bold text-2xl md:text-3xl tracking-tight">
            <span className="gradient-text">{t}</span>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>
        ))}
      </div>
    </div>
  );
};
