import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Star, Minus, Plus, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import api from "@/api/axios";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data;
    },
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["products", "similar", product?.category?._id],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data.filter(p => p.category?._id === product?.category?._id && p._id !== product?._id).slice(0, 4);
    },
    enabled: !!product?.category?._id,
  });

  const handleAddToCart = () => {
    if (!product) return;
    const compatibleProduct = {
      ...product,
      id: product._id,
      name: product.title,
      image: product.images[0]
    };
    addToCart(compatibleProduct, quantity);
    toast.success(`${product.title} added to cart`);
  };

  if (isLoading) {
    return <div className="container py-20 text-center">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground text-lg">Product not found</p>
        <Link to="/products" className="text-primary text-sm mt-2 inline-block">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="overflow-hidden rounded-xl bg-muted aspect-[3/4]">
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2">{product.category?.name}</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{product.ratings?.average || 0}</span>
            </div>
            <span className="text-xs text-muted-foreground">({product.ratings?.count || 0} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
            {product.discountPrice && (
              <span className="text-lg text-muted-foreground line-through">₹{product.discountPrice}</span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center gap-2 mb-4 text-sm">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1 text-primary"><Check className="w-4 h-4" /> In Stock</span>
            ) : (
              <span className="text-destructive">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border rounded-full">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-muted-foreground hover:text-foreground">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            size="lg"
            className="gradient-gold text-primary-foreground border-0 rounded-full font-body font-semibold"
          >
            <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map((p) => (
              <ProductCard key={p._id} product={{
                ...p,
                id: p._id,
                name: p.title,
                image: p.images[0]
              }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;