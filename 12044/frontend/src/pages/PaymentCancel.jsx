import { Link } from "react-router-dom";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentCancel = () => {
  return (
    <div className="container py-20 max-w-lg mx-auto text-center">
      {/* Animated cancel icon */}
      <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-14 h-14 text-red-500" />
      </div>

      <h1 className="font-heading text-3xl font-bold mb-3">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-4 text-lg">
        Your payment was cancelled. No charges have been made.
      </p>
      <p className="text-muted-foreground text-sm mb-8">
        Your cart items are still saved. You can retry the payment anytime.
      </p>

      <div className="bg-card border rounded-xl p-5 mb-8 text-sm text-muted-foreground">
        <p>💡 <strong>Tip:</strong> If you faced any issue during payment, try using a different card or switching to Cash on Delivery.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          asChild
          size="lg"
          className="gradient-gold text-primary-foreground border-0 rounded-full font-body font-semibold"
        >
          <Link to="/checkout">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Try Again
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full">
          <Link to="/products">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentCancel;
