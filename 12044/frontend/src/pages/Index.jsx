import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import api from "@/api/axios";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },
  });

  const featured = products.slice(0, 4);

  if (productsLoading || categoriesLoading) {
    return <div className="container py-20 text-center">Loading Bazzarly...</div>;
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] overflow-hidden">
        <img
          src={heroBanner}
          alt="Bazzarly premium fashion"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="relative container h-full flex flex-col justify-center">
          <div className="max-w-xl animate-fade-in">
            <p className="text-primary font-body text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              New Collection 2026
            </p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-background leading-tight mb-6">
              Discover Premium Style
            </h1>
            <p className="text-background/80 text-lg mb-8 font-body">
              Curated fashion essentials crafted for those who appreciate quality and timeless design.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="gradient-gold text-primary-foreground border-0 rounded-full px-8 font-body font-semibold">
                <Link to="/products">Shop Now <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b">
        <div className="container py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
          { icon: Truck, title: "Free Shipping", desc: "On orders over ₹8000" },
          { icon: Shield, title: "Secure Payment", desc: "100% protected checkout" },
          { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" }].
          map(({ icon: Icon, title, desc }) =>
          <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="font-heading text-3xl font-bold text-center mb-10">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) =>
          <Link
            key={cat._id}
            to={`/products?category=${cat.name}`}
            className="px-6 py-3 rounded-full border text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
            
              {cat.name}
            </Link>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) =>
          <ProductCard key={product._id} product={{
            ...product,
            id: product._id,
            name: product.title,
            image: product.images[0]
          }} />
          )}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-card border-y">
        <div className="container py-16 text-center max-w-2xl mx-auto">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) =>
            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            )}
          </div>
          <blockquote className="font-heading text-xl md:text-2xl italic text-foreground mb-4">
            "Bazzarly's collection is absolutely stunning. The quality of their products is unmatched and the shopping experience is seamless."
          </blockquote>
          <p className="text-sm text-muted-foreground">— Sarah M., Verified Customer</p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container py-16 text-center">
        <h2 className="font-heading text-3xl font-bold mb-3">Stay in the Loop</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Subscribe for exclusive offers, new arrivals, and style inspiration.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex max-w-md mx-auto gap-2">
          
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          
          <Button type="submit" className="gradient-gold text-primary-foreground border-0 rounded-full px-6 font-body font-semibold">
            Subscribe
          </Button>
        </form>
      </section>
    </div>);

};

export default Index;