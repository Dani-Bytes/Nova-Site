import { Instagram, Twitter, Youtube, ArrowRight, Sparkles } from "lucide-react";

export const Footer = () => (
  <footer className="relative mt-20">
    {/* Newsletter */}
    <div className="container">
      <div className="relative glass-strong rounded-[2.5rem] p-10 md:p-16 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/40 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/40 blur-3xl rounded-full" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Be first in line</div>
            <h3 className="font-display font-bold text-3xl md:text-5xl tracking-tighter">
              Get the drop <span className="gradient-text">before everyone</span> else.
            </h3>
          </div>
          <form className="flex glass rounded-full p-2 group focus-within:ring-2 focus-within:ring-accent transition">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent outline-none px-5 text-sm placeholder:text-muted-foreground"
            />
            <button className="inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground font-semibold px-6 py-3 rounded-full glow-hover">
              Notify me <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>

    <div className="container py-16 grid md:grid-cols-4 gap-10">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 font-display font-bold text-2xl mb-4">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="gradient-text">NOVA</span>
        </div>
        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
          A Gen-Z fashion & tech house. Limited drops, infinite vibes. Made for the timeline, built for the streets.
        </p>
        <div className="flex gap-3 mt-6">
          {[Instagram, Twitter, Youtube].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-gradient-hero hover:scale-110 transition-all">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
      {[
        { t: "Shop", links: ["New drops", "Streetwear", "Tech", "Sale"] },
        { t: "Help", links: ["Shipping", "Returns", "Sizing", "Contact"] },
      ].map((c) => (
        <div key={c.t}>
          <h4 className="font-display font-bold mb-4">{c.t}</h4>
          <ul className="space-y-2">
            {c.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-muted-foreground hover:text-accent transition">{l}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="border-t border-border/50">
      <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
        <div>© 2026 NOVA. All vibes reserved.</div>
        <div className="flex gap-6"><a href="#" className="hover:text-foreground">Privacy</a><a href="#" className="hover:text-foreground">Terms</a></div>
      </div>
    </div>
  </footer>
);
