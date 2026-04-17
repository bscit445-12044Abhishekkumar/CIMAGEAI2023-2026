import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import api from "@/api/axios";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    zipCode: "",
  });

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-2">Nothing to checkout</h1>
        <p className="text-muted-foreground mb-6">Add some items to your cart first.</p>
        <Button asChild className="gradient-gold text-primary-foreground border-0 rounded-full px-8 font-body font-semibold">
          <Link to="/products">Shop Now</Link>
        </Button>
      </div>
    );
  }

  const shipping = totalPrice >= 8000 ? 0 : 99;
  const total = totalPrice + shipping;

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

const handlePlaceOrder = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const orderData = {
    items: items.map((item) => ({
      product: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    })),
    shippingAddress: {
      fullName: `${address.firstName} ${address.lastName}`,
      phone: address.phone,
      city: address.city,
      pincode: address.zipCode,
      addressLine: address.addressLine,
    },
    paymentMethod,
    totalAmount: total,
  };

  try {
    if (paymentMethod === "card") {
      // 1. Create unpaid order first
      const orderRes = await api.post("/orders", orderData);
      const orderId = orderRes.data._id;

      // 2. Prepare Stripe line items
      const stripeItems = items.map((item) => ({
        name: item.product.title || item.product.name,
        image:
          item.product.images?.[0] ||
          item.product.image ||
          "",
        price: item.product.price,
        quantity: item.quantity,
      }));

      // 3. Create Stripe checkout session
      const { data } = await api.post(
        "/payments/create-checkout-session",
        {
          items: stripeItems,
          orderId,
        }
      );

      // 4. Redirect to Stripe
      window.location.href = data.url;
    } else {
      // COD flow
      await api.post("/orders", orderData);

      toast.success("Order placed successfully! 🎉");
      clearCart();

      navigate("/orders");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Failed to place order. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="container py-10">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "First Name", name: "firstName" },
                { label: "Last Name", name: "lastName" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone", type: "tel" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input
                    name={name}
                    type={type || "text"}
                    required
                    value={address[name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Address</label>
                <input
                  name="addressLine"
                  type="text"
                  required
                  value={address.addressLine}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">City</label>
                <input
                  name="city"
                  type="text"
                  required
                  value={address.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">PIN Code</label>
                <input
                  name="zipCode"
                  type="text"
                  required
                  value={address.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h2>
            <div className="flex gap-3">
              <button
                type="button"
                id="payment-card"
                onClick={() => setPaymentMethod("card")}
                className={`flex-1 p-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                    : "text-muted-foreground hover:border-primary/50"
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span>Credit / Debit Card</span>
                <span className="text-xs text-muted-foreground font-normal">Powered by Stripe</span>
              </button>
              <button
                type="button"
                id="payment-cod"
                onClick={() => setPaymentMethod("cod")}
                className={`flex-1 p-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
                    : "text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Truck className="w-6 h-6" />
                <span>Cash on Delivery</span>
                <span className="text-xs text-muted-foreground font-normal">Pay when delivered</span>
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Secure payment via Stripe</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll be redirected to Stripe's secure page to complete your payment. Your card details are never stored by us.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="font-heading text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm gap-2">
                <span className="text-muted-foreground truncate">{product.name} × {quantity}</span>
                <span className="font-medium shrink-0">₹{(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? <span className="text-primary">Free</span> : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-bold">₹{total.toFixed(2)}</span>
            </div>
          </div>
          <Button
            type="submit"
            id="place-order-btn"
            size="lg"
            className="w-full mt-6 gradient-gold text-primary-foreground border-0 rounded-full font-body font-semibold"
            disabled={isLoading}
          >
            {isLoading
              ? (paymentMethod === "card" ? "Redirecting to Stripe..." : "Placing Order...")
              : paymentMethod === "card"
              ? `Pay ₹${total.toFixed(2)} with Stripe`
              : `Place Order — ₹${total.toFixed(2)}`
            }
          </Button>
          {paymentMethod === "card" && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">256-bit SSL encrypted transaction</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Checkout;