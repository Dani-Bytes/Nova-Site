import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/authService";
import type { User } from "@/types/auth";
import { decodeJwt } from "@/lib/jwt";

const TOKEN_KEY = "nova_token";
const USER_KEY = "nova_user";

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseStoredUser = () => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) {
        return null;
    }
    try {
        return JSON.parse(stored) as User;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState<User | null>(() => parseStoredUser());
    const [loading, setLoading] = useState(true);

    const setAuthState = (nextToken: string | null, nextUser: User | null) => {
        if (nextToken) {
            localStorage.setItem(TOKEN_KEY, nextToken);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }

        if (nextUser) {
            localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        } else {
            localStorage.removeItem(USER_KEY);
        }

        setToken(nextToken);
        setUser(nextUser);
    };

    const refresh = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { user: me } = await authService.getMe();
            setAuthState(token, me);
        } catch {
            setAuthState(null, null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [token]);

    const login = async (email: string, password: string) => {
        const { user: loggedInUser, token: authToken } = await authService.login({ email, password });
        setAuthState(authToken, loggedInUser);
    };

    const register = async (name: string, email: string, password: string) => {
        const { user: newUser, token: authToken } = await authService.register({ name, email, password });
        setAuthState(authToken, newUser);
    };

    const logout = () => {
        setAuthState(null, null);
    };

    const isAdmin = useMemo(() => {
        if (user?.role) {
            return user.role === "admin";
        }
        if (!token) {
            return false;
        }
        return decodeJwt(token)?.role === "admin";
    }, [token, user]);

    return (
        <AuthContext.Provider value={{ user, token, isAdmin, loading, login, register, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
