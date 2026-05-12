import heroImg from "@/assets/hero.jpg";
import { ArrowRight, Play } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden">
      {/* animated blobs */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="absolute top-40 -right-20 w-[500px] h-[500px] rounded-full bg-accent/30 blur-3xl animate-blob" style={{ animationDelay: "-6s" }} />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-neon/20 blur-3xl animate-blob" style={{ animationDelay: "-12s" }} />

      <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-accent animate-glow-pulse" />
            DROP 07 — Live now
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tighter">
            Wear the <br />
            <span className="gradient-text">future</span>,<br /> today.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Iridescent fits, holographic accessories, and tech that hits different. Curated for those who don't follow trends — they start them.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="group relative inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground font-semibold px-7 py-4 rounded-full overflow-hidden glow-hover">
              <span className="relative z-10">Shop the drop</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,hsl(0_0%_100%/0.3)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer" />
            </button>
            <button className="group inline-flex items-center gap-3 glass rounded-full pl-2 pr-6 py-2 hover:bg-white/10 transition">
              <span className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <Play className="w-4 h-4 fill-primary-foreground text-primary-foreground" />
              </span>
              <span className="text-sm font-medium">Watch the film</span>
            </button>
          </div>
          <div className="flex items-center gap-8 pt-6">
            {[
              { n: "120K+", l: "Gen-Z fans" },
              { n: "4.9★", l: "App rating" },
              { n: "48h", l: "Free shipping" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-bold gradient-text">{s.n}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="absolute inset-0 bg-gradient-hero blur-3xl opacity-40 animate-glow-pulse" />
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass-strong p-2 animate-float">
            <img
              src={heroImg}
              alt="Iridescent streetwear model"
              width={1536}
              height={1536}
              className="w-full h-full object-cover rounded-[2rem]"
            />
            {/* floating tag */}
            <div className="absolute top-8 left-8 glass-strong rounded-2xl px-4 py-3 animate-float" style={{ animationDelay: "-2s" }}>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Featured</div>
              <div className="font-display font-bold">Holo Jacket</div>
              <div className="text-xs text-accent font-semibold">$189</div>
            </div>
            <div className="absolute bottom-8 right-8 glass-strong rounded-full pl-1 pr-4 py-1 flex items-center gap-2 animate-float" style={{ animationDelay: "-4s" }}>
              <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-xs font-bold">+</div>
              <span className="text-xs font-medium">Add to bag</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
