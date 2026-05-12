import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { User } from "@/types/auth";
import {
    deleteProduct,
    listProducts,
} from "@/services/productService";
import { listOrders, updateOrderStatus } from "@/services/orderService";
import { productImageFallback, resolveProductImage } from "@/lib/images";
import { formatCurrency } from "@/lib/currency";

/* ─── Order status options ─── */
const ORDER_STATUSES: Order["status"][] = ["pending", "paid", "shipped", "delivered", "cancelled"];

const statusColors: Record<Order["status"], string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    paid: "bg-emerald-500/20 text-emerald-400",
    shipped: "bg-blue-500/20 text-blue-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
};

/* ─── Products Tab ─── */
const ProductsTab = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: products, isLoading, error } = useQuery({
        queryKey: ["admin-products"],
        queryFn: () => listProducts(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold">All Products</h2>
                <Button onClick={() => navigate("/admin/product")}>+ Add product</Button>
            </div>

            {isLoading ? <Spinner label="Loading products" /> : null}
            {error ? (
                <ErrorMessage message={error instanceof Error ? error.message : "Unable to load"} />
            ) : null}

            {products && products.length === 0 ? (
                <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
                    No products yet. Add your first drop.
                </div>
            ) : null}

            {products ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <div key={product._id} className="glass rounded-3xl p-4 flex flex-col gap-4">
                            <img
                                src={resolveProductImage(product.imageUrl)}
                                alt={product.name}
                                className="h-40 w-full rounded-2xl object-cover"
                                onError={(event) => {
                                    const target = event.currentTarget;
                                    if (target.src !== productImageFallback) {
                                        target.src = productImageFallback;
                                    }
                                }}
                            />
                            <div>
                                <div className="font-display text-lg font-semibold">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.category}</div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>{formatCurrency(product.price)}</span>
                                <span className="text-muted-foreground">Stock {product.stock}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/admin/product?id=${product._id}`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteMutation.mutate(product._id)}
                                    disabled={deleteMutation.isPending}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

/* ─── Orders Tab ─── */
const OrdersTab = () => {
    const queryClient = useQueryClient();
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: listOrders,
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
            updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
            setUpdatingId(null);
        },
    });

    const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
        setUpdatingId(orderId);
        statusMutation.mutate({ id: orderId, status: newStatus });
    };

    const getUserDisplay = (user: string | User) => {
        if (typeof user === "string") return user.slice(-6);
        return user.name || user.email;
    };

    return (
        <div>
            <h2 className="font-display text-xl font-semibold mb-6">All Orders</h2>

            {isLoading ? <Spinner label="Loading orders" /> : null}
            {error ? (
                <ErrorMessage message={error instanceof Error ? error.message : "Unable to load orders"} />
            ) : null}

            {orders && orders.length === 0 ? (
                <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
                    No orders yet.
                </div>
            ) : null}

            {orders ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="glass rounded-3xl p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.3em] text-accent">Order</div>
                                    <div className="font-display text-xl font-semibold">
                                        #{order._id.slice(-6)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {new Date(order.createdAt).toLocaleDateString()} &middot;{" "}
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <div className="text-muted-foreground">Customer</div>
                                    <div className="font-semibold">{getUserDisplay(order.user)}</div>
                                </div>

                                <div className="text-sm">
                                    <div className="text-muted-foreground">Items</div>
                                    <div className="font-semibold">{order.items.length}</div>
                                </div>

                                <div className="text-sm">
                                    <div className="text-muted-foreground">Total</div>
                                    <div className="font-semibold">{formatCurrency(order.total)}</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                            statusColors[order.status]
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order._id, e.target.value as Order["status"])
                                        }
                                        disabled={updatingId === order._id && statusMutation.isPending}
                                        className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                                    >
                                        {ORDER_STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="space-y-2 border-t border-border/30 pt-4">
                                {order.items.map((item) => (
                                    <div key={item.product} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={resolveProductImage(item.imageUrl)}
                                                alt={item.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                                onError={(event) => {
                                                    const target = event.currentTarget;
                                                    if (target.src !== productImageFallback) {
                                                        target.src = productImageFallback;
                                                    }
                                                }}
                                            />
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-muted-foreground">
                                                    Qty {item.quantity} × {formatCurrency(item.price)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-medium">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

/* ─── Admin Dashboard ─── */
const AdminDashboard = () => {
    return (
        <PageShell>
            <section className="container pt-32 pb-24">
                <div className="mb-8">
                    <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Admin control</div>
                    <h1 className="font-display text-4xl font-bold">Dashboard</h1>
                </div>

                <Tabs defaultValue="products" className="w-full">
                    <TabsList className="glass mb-8">
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products">
                        <ProductsTab />
                    </TabsContent>

                    <TabsContent value="orders">
                        <OrdersTab />
                    </TabsContent>
                </Tabs>
            </section>
        </PageShell>
    );
};

export default AdminDashboard;
