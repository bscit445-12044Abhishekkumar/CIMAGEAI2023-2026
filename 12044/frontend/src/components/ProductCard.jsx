import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-in">
      
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
        {product.badge &&
        <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full gradient-gold text-primary-foreground">
            {product.badge}
          </span>
        }
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary">
          
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category?.name || product.category}</p>
        <h3 className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">₹{product.price}</span>
          {product.originalPrice &&
          <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
          }
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
        </div>
      </div>
    </Link>);

};

export default ProductCard;