import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/PageShell";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { listMyOrders } from "@/services/orderService";
import { productImageFallback, resolveProductImage } from "@/lib/images";
import { formatCurrency } from "@/lib/currency";

const Orders = () => {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: listMyOrders,
    });

    return (
        <PageShell>
            <section className="container pt-32 pb-24">
                <div className="mb-8">
                    <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Order history</div>
                    <h1 className="font-display text-4xl font-bold">Your orders</h1>
                </div>

                {isLoading ? <Spinner label="Loading orders" /> : null}
                {error ? (
                    <ErrorMessage message={error instanceof Error ? error.message : "Unable to load orders"} />
                ) : null}

                {orders && orders.length === 0 ? (
                    <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
                        You have no orders yet.
                    </div>
                ) : null}

                {orders ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="glass rounded-3xl p-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-accent">Order</div>
                                        <div className="font-display text-xl font-semibold">#{order._id.slice(-6)}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-muted-foreground">Status</div>
                                        <div className="font-semibold capitalize">{order.status}</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-muted-foreground">Total</div>
                                        <div className="font-semibold">{formatCurrency(order.total)}</div>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.product} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={resolveProductImage(item.imageUrl)}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                    onError={(event) => {
                                                        const target = event.currentTarget;
                                                        if (target.src !== productImageFallback) {
                                                            target.src = productImageFallback;
                                                        }
                                                    }}
                                                />
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-muted-foreground">Qty {item.quantity}</div>
                                                </div>
                                            </div>
                                            <div>{formatCurrency(item.price * item.quantity)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </section>
        </PageShell>
    );
};

export default Orders;
