import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, ChevronRight, Truck } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data || []);
      } catch (error) {
        console.error("Order fetch error:", error.response?.data || error.message);

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load orders.",
        });

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  if (loading) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-heading font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center shadow-sm">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-bold mb-2">No orders placed yet</h2>
          <p className="text-muted-foreground mb-6">
            Explore our products and start shopping.
          </p>

          <Button asChild className="gradient-gold text-primary-foreground border-0 rounded-full px-8">
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    Order ID
                  </p>
                  <p className="text-sm font-mono text-primary truncate max-w-[200px]">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    Placed on
                  </p>
                  <p className="text-sm">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    Total Amount
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    ₹{Number(order?.totalAmount || 0).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
                    Status
                  </p>
                  <Badge variant="secondary">
                    {order?.orderStatus || "Pending"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-4 overflow-hidden py-1">
                  {(order?.items || []).slice(0, 3).map((item, index) => (
                    <img
                      key={index}
                      src={
                        item?.product?.images?.[0] ||
                        "https://images.unsplash.com/photo-1555529733-0e67040fd176?q=80&w=300"
                      }
                      alt={item?.product?.title || "Product"}
                      className="inline-block h-12 w-12 rounded-full border-2 border-background object-cover bg-muted"
                    />
                  ))}
                </div>

                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Contains {(order?.items || []).length} items
                  </p>
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/orders/${order._id}`}>
                    Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                <Truck className="w-3.5 h-3.5 text-primary" />
                <span>
                  Shipping via{" "}
                  {order?.paymentMethod === "cod"
                    ? "Standard Delivery (COD)"
                    : "Express Delivery"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;