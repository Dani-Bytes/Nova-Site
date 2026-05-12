import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

const products = [
  { id: 1, name: "Aura Runner", tag: "New", price: 149, img: p1 },
  { id: 2, name: "Holo Mini Bag", tag: "Hot", price: 89, img: p2 },
  { id: 3, name: "Cloud Hoodie", tag: "Drop", price: 119, img: p3 },
  { id: 4, name: "Pixel Shades", tag: "New", price: 59, img: p4 },
  { id: 5, name: "Sonic Cans", tag: "-20%", price: 199, img: p5 },
  { id: 6, name: "Lilac Case", tag: "Cute", price: 29, img: p6 },
];

export const ProductGrid = () => {
  const [liked, setLiked] = useState<number[]>([]);
  const toggle = (id: number) =>
    setLiked((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  return (
    <section id="shop" className="container py-24 relative">
      <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Trending now</div>
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tighter">
            Drops you'll <span className="gradient-text">obsess</span> over.
          </h2>
        </div>
        <div className="flex gap-2">
          {["All", "Wear", "Tech", "Bags"].map((f, i) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                i === 0 ? "bg-gradient-hero text-primary-foreground" : "glass hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <article
            key={p.id}
            className="group relative glass rounded-3xl p-3 hover:-translate-y-2 transition-all duration-500 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-soft">
              <img
                src={p.img}
                alt={p.name}
                width={768}
                height={768}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute top-3 left-3 glass-strong text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                {p.tag}
              </span>
              <button
                onClick={() => toggle(p.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition"
              >
                <Heart
                  className={`w-4 h-4 transition ${
                    liked.includes(p.id) ? "fill-accent text-accent scale-110" : "text-foreground"
                  }`}
                />
              </button>
              <button className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground text-sm font-semibold pl-2 pr-4 py-2 rounded-full opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 glow-hover">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-display font-semibold">{p.name}</h3>
                <div className="text-xs text-muted-foreground">Limited edition</div>
              </div>
              <div className="font-display font-bold text-lg gradient-text">${p.price}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
