import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
        <Button asChild className="gradient-gold text-primary-foreground border-0 rounded-full px-8 font-body font-semibold">
          <Link to="/products">Start Shopping</Link>
        </Button>
      </div>);

  }

  const shipping = totalPrice >= 100 ? 0 : 9.99;
  const total = totalPrice + shipping;

  return (
    <div className="container py-10">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>
      <h1 className="font-heading text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 p-4 rounded-xl border bg-card">
              <Link to={`/product/${product.id}`} className="w-24 h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${product.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                    {product.name}
                  </Link>
                  <p className="text-muted-foreground text-xs mb-3">{product.category?.name || product.category}</p>
                  <p className="font-semibold text-sm">₹{product.price}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-full">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 px-2 text-muted-foreground hover:text-foreground">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 px-2 text-muted-foreground hover:text-foreground">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-bold">₹{(product.price * quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(product.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="font-heading text-lg font-bold mb-4">Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-primary">Free</span>
            </div>
          </div>
          <div className="border-t pt-4 mb-6 flex justify-between items-baseline">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
          </div>
          <Button asChild size="lg" className="w-full gradient-gold text-primary-foreground border-0 rounded-full font-body font-semibold">
            <Link to="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>);

};

export default Cart;