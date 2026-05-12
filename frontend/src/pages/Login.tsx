import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as { from?: { pathname: string } } | null;
    const from = locationState?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            setLoading(true);
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell showFooter={false}>
            <section className="container pt-32 pb-20">
                <div className="max-w-md mx-auto glass rounded-3xl p-8">
                    <div className="mb-6">
                        <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Welcome back</div>
                        <h1 className="font-display font-bold text-3xl">Sign in to NOVA</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-muted-foreground">Email</label>
                            <Input
                                type="email"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Password</label>
                            <Input
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="mt-2"
                            />
                        </div>

                        {error ? <div className="text-sm text-destructive">{error}</div> : null}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <div className="mt-6 text-sm text-muted-foreground">
                        New here?{" "}
                        <Link to="/register" className="text-accent hover:text-foreground">
                            Create an account
                        </Link>
                    </div>
                </div>
            </section>
        </PageShell>
    );
};

export default Login;
