import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Categories } from "@/components/Categories";
import { ProductGrid } from "@/components/ProductGrid";
import { Testimonials } from "@/components/Testimonials";
import { PageShell } from "@/components/PageShell";

const Index = () => (
  <PageShell>
    <Hero />
    <Marquee />
    <Categories />
    <ProductGrid />
    <Testimonials />
  </PageShell>
);

export default Index;
