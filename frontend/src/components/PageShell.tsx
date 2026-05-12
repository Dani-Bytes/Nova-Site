import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface PageShellProps {
    children: ReactNode;
    showFooter?: boolean;
}

export const PageShell = ({ children, showFooter = true }: PageShellProps) => {
    return (
        <main className="min-h-screen overflow-x-hidden">
            <Navbar />
            {children}
            {showFooter ? <Footer /> : null}
        </main>
    );
};
