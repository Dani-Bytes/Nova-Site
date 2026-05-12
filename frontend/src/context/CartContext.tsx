import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

const CART_KEY = "nova_cart";

interface CartContextValue {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const parseStoredCart = () => {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) {
        return [] as CartItem[];
    }
    try {
        return JSON.parse(stored) as CartItem[];
    } catch {
        return [] as CartItem[];
    }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(() => parseStoredCart());

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product, quantity = 1) => {
        setItems((current) => {
            const existing = current.find((item) => item.productId === product._id);
            if (!existing) {
                return [
                    ...current,
                    {
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        quantity: Math.min(quantity, product.stock),
                        stock: product.stock,
                    },
                ];
            }

            return current.map((item) =>
                item.productId === product._id
                    ? {
                        ...item,
                        quantity: Math.min(item.quantity + quantity, item.stock),
                    }
                    : item,
            );
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        const safeQuantity = Number.isNaN(quantity) ? 1 : quantity;
        setItems((current) =>
            current.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        quantity: Math.max(1, Math.min(safeQuantity, item.stock)),
                    }
                    : item,
            ),
        );
    };

    const removeItem = (productId: string) => {
        setItems((current) => current.filter((item) => item.productId !== productId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
        [items],
    );

    return (
        <CartContext.Provider
            value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, subtotal }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
};
