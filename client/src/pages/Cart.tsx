import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/services/orderService";
import { productImageFallback, resolveProductImage } from "@/lib/images";
import { formatCurrency } from "@/lib/currency";

const Cart = () => {
    const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }

        if (items.length === 0) {
            setError("Your cart is empty");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await createOrder(items.map((item) => ({ productId: item.productId, quantity: item.quantity })));
            clearCart();
            navigate("/orders");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell>
            <section className="container pt-32 pb-24">
                <div className="mb-8">
                    <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Your bag</div>
                    <h1 className="font-display text-4xl font-bold">Cart</h1>
                </div>

                {items.length === 0 ? (
                    <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
                        Your cart is empty. Add something you love.
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.productId} className="glass rounded-3xl p-5 flex flex-col md:flex-row gap-6">
                                    <img
                                        src={resolveProductImage(item.imageUrl)}
                                        alt={item.name}
                                        className="w-full md:w-32 h-32 object-cover rounded-2xl"
                                        onError={(event) => {
                                            const target = event.currentTarget;
                                            if (target.src !== productImageFallback) {
                                                target.src = productImageFallback;
                                            }
                                        }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-display text-xl font-semibold">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="text-xs text-muted-foreground hover:text-destructive"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            {formatCurrency(item.price)}
                                        </div>
                                        <div className="mt-4 flex items-center gap-3">
                                            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Qty</span>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={item.stock}
                                                value={item.quantity}
                                                onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                                                className="w-24"
                                            />
                                        </div>
                                    </div>
                                    <div className="font-display text-2xl font-bold gradient-text">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="glass rounded-3xl p-6 h-fit">
                            <div className="text-sm uppercase tracking-[0.3em] text-accent">Summary</div>
                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="border-t border-border/50 pt-3 flex items-center justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                            </div>

                            {error ? <div className="text-sm text-destructive mt-4">{error}</div> : null}

                            <Button className="w-full mt-6" onClick={handleCheckout} disabled={loading}>
                                {loading ? "Placing order..." : "Place order"}
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </PageShell>
    );
};

export default Cart;
