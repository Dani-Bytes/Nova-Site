import { ArrowUpRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

const cats = [
  { name: "Streetwear", count: "248 items", grad: "from-primary to-accent" },
  { name: "Sneakers", count: "92 items", grad: "from-accent to-neon" },
  { name: "Accessories", count: "164 items", grad: "from-neon to-primary" },
  { name: "Tech", count: "57 items", grad: "from-primary via-accent to-neon" },
  { name: "Y2K", count: "31 items", grad: "from-accent to-primary" },
  { name: "Beauty", count: "84 items", grad: "from-neon to-accent" },
];

export const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSelect = (category: string) => {
    const next = new URLSearchParams(searchParams);
    if (!category) {
      next.delete("category");
    } else {
      if (!PRODUCT_CATEGORIES.includes(category)) {
        return;
      }
      next.set("category", category);
    }
    setSearchParams(next, { replace: true });
    window.location.hash = "shop";
  };

  return (
    <section className="py-20 relative">
      <div className="container mb-10 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Shop by vibe</div>
          <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tighter">
            Pick your <span className="gradient-text">aesthetic</span>
          </h2>
        </div>
        <button
          onClick={() => handleSelect("")}
          className="hidden md:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          See all <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-6 md:px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))] pb-6">
        {cats.map((c, i) => (
          <button
            key={c.name}
            onClick={() => handleSelect(c.name)}
            className="snap-start shrink-0 w-72 h-96 relative rounded-3xl overflow-hidden glass group cursor-pointer animate-fade-up text-left"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${c.grad} opacity-80 group-hover:opacity-100 transition`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(0_0%_100%/0.3),transparent_60%)]" />
            <div className="relative h-full flex flex-col justify-between p-6 text-primary-foreground">
              <div className="flex justify-end">
                <span className="w-10 h-10 rounded-full glass-strong flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest opacity-80">{c.count}</div>
                <h3 className="font-display font-bold text-4xl mt-2 tracking-tight">{c.name}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
