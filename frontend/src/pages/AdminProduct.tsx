import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/Spinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { Product } from "@/types/product";
import {
    createProduct,
    getProductById,
    updateProduct,
} from "@/services/productService";

const defaultForm = {
    name: "",
    description: "",
    price: "",
    category: PRODUCT_CATEGORIES[0],
    imageUrl: "",
    stock: "",
    rating: "",
};

const AdminProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get("id");
    const isEditing = Boolean(editId);

    const [form, setForm] = useState(defaultForm);
    const [error, setError] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    const { isLoading: loadingProduct } = useQuery({
        queryKey: ["admin-product", editId],
        queryFn: () => getProductById(editId as string),
        enabled: Boolean(editId),
        onSuccess: (product: Product) => {
            if (!initialized) {
                setForm({
                    name: product.name,
                    description: product.description,
                    price: String(product.price),
                    category: product.category,
                    imageUrl: product.imageUrl,
                    stock: String(product.stock),
                    rating: String(product.rating ?? ""),
                });
                setInitialized(true);
            }
        },
    } as any);

    const createMutation = useMutation({
        mutationFn: (payload: Omit<Product, "_id">) => createProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<Omit<Product, "_id">> }) =>
            updateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        },
    });

    const parsedPayload = useMemo(() => {
        const payload: Partial<Omit<Product, "_id">> = {
            name: form.name.trim(),
            description: form.description.trim(),
            category: form.category,
            imageUrl: form.imageUrl.trim(),
        };

        if (form.price !== "") {
            payload.price = Number(form.price);
        }
        if (form.stock !== "") {
            payload.stock = Number(form.stock);
        }
        if (form.rating !== "") {
            payload.rating = Number(form.rating);
        }

        return payload;
    }, [form]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!parsedPayload.name || !parsedPayload.description || !parsedPayload.category || !parsedPayload.imageUrl) {
            setError("All product fields are required");
            return;
        }

        if (parsedPayload.price === undefined || Number.isNaN(parsedPayload.price)) {
            setError("Valid price is required");
            return;
        }

        if (parsedPayload.stock === undefined || Number.isNaN(parsedPayload.stock)) {
            setError("Valid stock is required");
            return;
        }

        if (parsedPayload.rating !== undefined) {
            if (Number.isNaN(parsedPayload.rating)) {
                setError("Valid rating is required");
                return;
            }
            if (parsedPayload.rating < 0 || parsedPayload.rating > 5) {
                setError("Rating must be between 0 and 5");
                return;
            }
        }

        try {
            if (isEditing && editId) {
                await updateMutation.mutateAsync({ id: editId, payload: parsedPayload });
            } else {
                await createMutation.mutateAsync(parsedPayload as Omit<Product, "_id">);
            }
            navigate("/admin");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to save product");
        }
    };

    return (
        <PageShell>
            <section className="container pt-32 pb-24">
                <div className="mb-8">
                    <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
                        {isEditing ? "Edit product" : "New product"}
                    </div>
                    <h1 className="font-display text-4xl font-bold">
                        {isEditing ? "Update product" : "Add new product"}
                    </h1>
                </div>

                <div className="max-w-xl">
                    {loadingProduct && isEditing ? (
                        <Spinner label="Loading product" />
                    ) : (
                        <div className="glass rounded-3xl p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-sm text-muted-foreground">Name</label>
                                    <Input
                                        value={form.name}
                                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Description</label>
                                    <Textarea
                                        value={form.description}
                                        onChange={(event) => setForm({ ...form, description: event.target.value })}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(event) => setForm({ ...form, category: event.target.value })}
                                        className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        {PRODUCT_CATEGORIES.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm text-muted-foreground">Price</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={form.price}
                                            onChange={(event) => setForm({ ...form, price: event.target.value })}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground">Stock</label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={form.stock}
                                            onChange={(event) => setForm({ ...form, stock: event.target.value })}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Image URL</label>
                                    <Input
                                        value={form.imageUrl}
                                        onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Rating (0-5)</label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={5}
                                        step="0.1"
                                        value={form.rating}
                                        onChange={(event) => setForm({ ...form, rating: event.target.value })}
                                        className="mt-2"
                                    />
                                </div>

                                {error ? <ErrorMessage message={error} /> : null}

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                        {isEditing ? "Update product" : "Create product"}
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={() => navigate("/admin")}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </PageShell>
    );
};

export default AdminProduct;
