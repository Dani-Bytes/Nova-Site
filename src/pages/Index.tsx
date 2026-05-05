import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Categories } from "@/components/Categories";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => (
  <main className="min-h-screen overflow-x-hidden">
    <Navbar />
    <Hero />
    <Marquee />
    <Categories />
    <ProductGrid />
    <Testimonials />
    <Footer />
  </main>
);

export default Index;
