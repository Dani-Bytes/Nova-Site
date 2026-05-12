import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { listProducts } from "@/services/productService";
import { Spinner } from "@/components/Spinner";
import { StarRating } from "@/components/StarRating";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useCart } from "@/context/CartContext";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { productImageFallback, resolveProductImage } from "@/lib/images";
import { formatCurrency } from "@/lib/currency";

export const ProductGrid = () => {
  const { addItem } = useCart();
  const [liked, setLiked] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", search, category],
    queryFn: () => listProducts({ search, category: category || undefined }),
  });

  const toggle = (id: string) =>
    setLiked((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  const filters = ["All", ...PRODUCT_CATEGORIES];

  const handleFilter = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "All") {
      next.delete("category");
    } else {
      next.set("category", value);
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <section id="shop" className="container py-24 relative">
      <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Trending now</div>
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tighter">
            Drops you'll <span className="gradient-text">obsess</span> over.
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => {
            const active = filter === "All" ? !category : category === filter;
            return (
              <button
                key={filter}
                onClick={() => handleFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${active ? "bg-gradient-hero text-primary-foreground" : "glass hover:bg-white/10"
                  }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? <Spinner label="Loading products" /> : null}
      {error ? (
        <ErrorMessage message={error instanceof Error ? error.message : "Unable to load"} />
      ) : null}

      {products && products.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
          No products yet. Check back soon.
        </div>
      ) : null}

      {products ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <article
              key={product._id}
              className="group relative glass rounded-3xl p-3 hover:-translate-y-2 transition-all duration-500 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-soft">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={resolveProductImage(product.imageUrl)}
                    alt={product.name}
                    width={768}
                    height={768}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(event) => {
                      const target = event.currentTarget;
                      if (target.src !== productImageFallback) {
                        target.src = productImageFallback;
                      }
                    }}
                  />
                </Link>
                <span className="absolute top-3 left-3 glass-strong text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <button
                  onClick={() => toggle(product._id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full glass-strong flex items-center justify-center hover:scale-110 transition"
                >
                  <Heart
                    className={`w-4 h-4 transition ${liked.includes(product._id)
                      ? "fill-accent text-accent scale-110"
                      : "text-foreground"
                      }`}
                  />
                </button>
                <button
                  onClick={() => addItem(product, 1)}
                  disabled={product.stock === 0}
                  className="absolute bottom-3 right-3 inline-flex items-center gap-2 bg-gradient-hero text-primary-foreground text-sm font-semibold pl-2 pr-4 py-2 rounded-full opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 glow-hover disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-display font-semibold">{product.name}</h3>
                  <StarRating rating={product.rating} size="sm" />
                </div>
                <div className="font-display font-bold text-lg gradient-text">
                  {formatCurrency(product.price)}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
};
