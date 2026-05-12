import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/StarRating";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getProductById } from "@/services/productService";
import { useCart } from "@/context/CartContext";
import { productImageFallback, resolveProductImage } from "@/lib/images";
import { formatCurrency } from "@/lib/currency";

const ProductDetail = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductById(id as string),
        enabled: Boolean(id),
    });

    const handleAdd = () => {
        if (product) {
            addItem(product, quantity);
        }
    };

    return (
        <PageShell>
            <section className="container pt-32 pb-24">
                {isLoading ? <Spinner label="Loading product" /> : null}
                {error ? (
                    <ErrorMessage message={error instanceof Error ? error.message : "Unable to load"} />
                ) : null}
                {!isLoading && product ? (
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div className="glass rounded-3xl p-4">
                            <img
                                src={resolveProductImage(product.imageUrl)}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-2xl"
                                onError={(event) => {
                                    const target = event.currentTarget;
                                    if (target.src !== productImageFallback) {
                                        target.src = productImageFallback;
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">{product.category}</div>
                                <h1 className="font-display text-4xl font-bold">{product.name}</h1>
                                <div className="mt-3">
                                    <StarRating rating={product.rating} size="md" showValue />
                                </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                            <div className="flex items-center gap-3">
                                <div className="font-display text-3xl font-bold gradient-text">
                                    {formatCurrency(product.price)}
                                </div>
                                <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                                    {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-24">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(event) => {
                                            const next = Number(event.target.value);
                                            if (Number.isNaN(next)) {
                                                setQuantity(1);
                                                return;
                                            }
                                            setQuantity(Math.max(1, Math.min(next, product.stock)));
                                        }}
                                    />
                                </div>
                                <Button onClick={handleAdd} disabled={product.stock === 0}>
                                    Add to cart
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </section>
        </PageShell>
    );
};

export default ProductDetail;
