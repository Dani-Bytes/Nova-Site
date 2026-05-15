import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, Sun, Moon, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(() => searchParams.get("search") || "");
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const isSearchExpanded = searchOpen || searchValue.length > 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const current = searchParams.get("search") || "";
    setSearchValue(current);
    if (current) {
      setSearchOpen(true);
    }
  }, [searchParams]);

  const links = ["New", "Drops", "Streetwear", "Tech", "Sale"];

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("search", value);
    } else {
      next.delete("search");
      setSearchOpen(false);
    }
    navigate({ pathname: "/", search: next.toString() });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"
        }`}
    >
      <nav
        className={`container flex items-center justify-between rounded-full px-4 md:px-6 py-3 transition-all duration-500 ${scrolled ? "glass-strong" : "glass"
          }`}
      >
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <Sparkles className="w-5 h-5 text-accent animate-glow-pulse" />
          <span className="gradient-text tracking-tighter">NOVA</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((label) => (
            <li key={label}>
              <Link
                to={{ pathname: "/", hash: "#shop" }}
                className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group"
              >
                {label}
                <span className="absolute left-4 right-4 -bottom-0.5 h-px bg-gradient-hero scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </li>
          ))}
          {user ? (
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/70"
                  }`
                }
              >
                Orders
              </NavLink>
            </li>
          ) : null}
          {isAdmin ? (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/70"
                  }`
                }
              >
                Admin
              </NavLink>
            </li>
          ) : null}
        </ul>

        <div className="flex items-center gap-1">
          <div
            className={`flex items-center transition-all duration-500 ${isSearchExpanded ? "w-44 md:w-56" : "w-9"
              } overflow-hidden`}
          >
            <button
              onClick={() => {
                setSearchOpen((s) => {
                  const next = !s;
                  if (next) {
                    requestAnimationFrame(() => searchInputRef.current?.focus());
                  }
                  return next;
                });
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search drops..."
              aria-label="Search products"
              value={searchValue}
              className={`bg-transparent text-sm flex-1 px-2 placeholder:text-muted-foreground outline-none transition-opacity duration-300 ${isSearchExpanded
                  ? "opacity-100 border-b border-white/20 focus:border-accent"
                  : "opacity-0 pointer-events-none"
                }`}
              onChange={(event) => handleSearchChange(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => {
                if (!searchValue) {
                  setSearchOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.currentTarget.blur();
                  if (!searchValue) {
                    setSearchOpen(false);
                  }
                }
              }}
            />
          </div>
          <button onClick={() => setDark((d) => !d)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition">
            <Heart className="w-4 h-4" />
          </button>
          <Link
            to="/cart"
            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-gradient-hero text-[10px] font-bold flex items-center justify-center text-primary-foreground animate-scale-in">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <button
              onClick={logout}
              className="hidden md:inline-flex items-center rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
          )}
          <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/5">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </header>
  );
};
