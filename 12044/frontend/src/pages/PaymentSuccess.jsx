import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import api from "@/api/axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setStatus("error");
        return;
      }

      try {
        await api.get(`/payments/verify?session_id=${sessionId}`);
        clearCart();
        setStatus("success");
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  if (status === "verifying") {
    return (
      <div className="container py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold mb-2 text-destructive">Something went wrong</h1>
        <p className="text-muted-foreground mb-6">We couldn't confirm your payment. Please contact support.</p>
        <Button asChild className="gradient-gold text-primary-foreground border-0 rounded-full px-8">
          <Link to="/orders">View My Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-20 max-w-lg mx-auto text-center">
      {/* Animated success icon */}
      <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6 animate-fade-in">
        <CheckCircle className="w-14 h-14 text-green-500" />
      </div>

      <h1 className="font-heading text-3xl font-bold mb-3 animate-fade-in">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Thank you for your purchase! Your order has been placed and is being processed.
      </p>

      <div className="bg-card border rounded-xl p-6 mb-8 text-left space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Order Confirmed</p>
            <p className="text-xs text-muted-foreground">Your order is now being prepared for shipping</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">Payment Captured</p>
            <p className="text-xs text-muted-foreground">Your payment was processed securely via Stripe</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          asChild
          size="lg"
          className="gradient-gold text-primary-foreground border-0 rounded-full font-body font-semibold"
        >
          <Link to="/orders">
            <ShoppingBag className="w-4 h-4 mr-2" />
            View My Orders
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
