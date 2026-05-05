import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, Menu, Sun, Moon, Sparkles } from "lucide-react";

export const Navbar = ({ cartCount = 3 }: { cartCount?: number }) => {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const links = ["New", "Drops", "Streetwear", "Tech", "Sale"];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <nav
        className={`container flex items-center justify-between rounded-full px-4 md:px-6 py-3 transition-all duration-500 ${
          scrolled ? "glass-strong" : "glass"
        }`}
      >
        <a href="#" className="flex items-center gap-2 font-display font-bold text-xl">
          <Sparkles className="w-5 h-5 text-accent animate-glow-pulse" />
          <span className="gradient-text tracking-tighter">NOVA</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l}>
              <a
                href="#"
                className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group"
              >
                {l}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-gradient-hero scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <div className={`flex items-center transition-all duration-500 ${searchOpen ? "w-44 md:w-56" : "w-9"} overflow-hidden`}>
            <button onClick={() => setSearchOpen((s) => !s)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition">
              <Search className="w-4 h-4" />
            </button>
            <input
              placeholder="Search drops..."
              className="bg-transparent border-b border-white/20 focus:border-accent outline-none text-sm flex-1 px-2 placeholder:text-muted-foreground"
            />
          </div>
          <button onClick={() => setDark((d) => !d)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition">
            <Heart className="w-4 h-4" />
          </button>
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition">
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gradient-hero text-[10px] font-bold flex items-center justify-center text-primary-foreground animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </header>
  );
};
