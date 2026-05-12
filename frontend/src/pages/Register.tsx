import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await register(name, email, password);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell showFooter={false}>
            <section className="container pt-32 pb-20">
                <div className="max-w-md mx-auto glass rounded-3xl p-8">
                    <div className="mb-6">
                        <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Start your vibe</div>
                        <h1 className="font-display font-bold text-3xl">Create your NOVA account</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-muted-foreground">Name</label>
                            <Input
                                placeholder="Nova fan"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="mt-2"
                            />
                        </div>
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
                                placeholder="Min 6 characters"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted-foreground">Confirm Password</label>
                            <Input
                                type="password"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                className="mt-2"
                            />
                        </div>

                        {error ? <div className="text-sm text-destructive">{error}</div> : null}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-accent hover:text-foreground">
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>
        </PageShell>
    );
};

export default Register;
