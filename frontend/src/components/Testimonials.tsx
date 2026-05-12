import { Star } from "lucide-react";

const reviews = [
  { name: "maya.k", handle: "@mayaaa", text: "ok the holo bag is unreal. shipping was insanely fast 🤍", rating: 5 },
  { name: "jordan", handle: "@jrdn.fits", text: "got the cloud hoodie. literally living in it. compliments daily.", rating: 5 },
  { name: "rae", handle: "@raepix", text: "their drops feel curated for my brain. obsessed isn't a strong enough word.", rating: 5 },
  { name: "soph", handle: "@sophhh", text: "pixel shades = main character energy. period.", rating: 5 },
];

export const Testimonials = () => (
  <section className="container py-24">
    <div className="text-center mb-14">
      <div className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Loved by the timeline</div>
      <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tighter">
        The <span className="gradient-text">vibe</span> is mutual.
      </h2>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {reviews.map((r, i) => (
        <div
          key={r.handle}
          className="glass rounded-3xl p-6 hover:-translate-y-1 transition-transform animate-fade-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-hero flex items-center justify-center font-display font-bold">
              {r.name[0].toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-sm">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.handle}</div>
            </div>
          </div>
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: r.rating }).map((_, k) => (
              <Star key={k} className="w-3.5 h-3.5 fill-accent text-accent" />
            ))}
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{r.text}</p>
        </div>
      ))}
    </div>
  </section>
);
