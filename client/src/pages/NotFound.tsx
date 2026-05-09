import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageShell showFooter={false}>
      <section className="container pt-32 pb-24 flex items-center justify-center">
        <div className="glass rounded-3xl p-10 text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-accent underline hover:text-foreground">
            Return to Home
          </a>
        </div>
      </section>
    </PageShell>
  );
};

export default NotFound;
