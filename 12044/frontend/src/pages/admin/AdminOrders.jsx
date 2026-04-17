import React, { useState } from "react";
import { Truck, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

const statusSteps = ["Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor = {
  Processing: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700"
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await api.get("/admin/orders");
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.put(`/admin/order/${id}`, { status });
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["admin-orders"], (old) =>
        old.map((order) => (order._id === data._id ? data : order))
      );
      toast.success(`Order status updated to ${data.orderStatus}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  });

  const updateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold">Manage Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders recorded</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
            filter === "all" ?
            "gradient-gold text-primary-foreground shadow-sm" :
            "border text-muted-foreground hover:border-primary/50"
          }`}
        >
          All Orders
        </button>
        {statusSteps.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
              filter === s ?
              "gradient-gold text-primary-foreground shadow-sm" :
              "border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b bg-muted/30">
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Customer</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Total</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Payment Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Order Status</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-5 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    No orders found matching this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-primary">{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-foreground">{order.user?.name || "Guest"}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email || "No email"}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold">₹{order.totalAmount?.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.paymentStatus === "paid" || order.isPaid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {order.paymentStatus || (order.isPaid ? "Paid" : "Pending")}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor[order.orderStatus] || "bg-muted text-muted-foreground"}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                    {expandedId === order._id && (
                      <tr className="bg-muted/10">
                        <td colSpan={7} className="px-5 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                            {/* Items View */}
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Order Items</p>
                              <div className="space-y-3 bg-card border rounded-lg p-4">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm">
                                    <div className="flex gap-3 items-center">
                                      {item.product?.images?.[0] && (
                                        <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded border object-cover" />
                                      )}
                                      <div>
                                        <p className="font-medium">{item.product?.title || "Unknown Product"}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                      </div>
                                    </div>
                                    <span className="font-semibold text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                                <div className="pt-3 border-t flex justify-between font-bold text-base">
                                  <span>Total</span>
                                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="mt-4 p-4 border rounded-lg bg-background/50">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Shipping Information</p>
                                <p className="text-sm font-medium">{order.shippingAddress?.fullName}</p>
                                <p className="text-xs text-muted-foreground">{order.shippingAddress?.addressLine}</p>
                                <p className="text-xs text-muted-foreground">{order.shippingAddress?.city}, {order.shippingAddress?.pincode}</p>
                                <p className="text-xs text-muted-foreground mt-1 font-semibold">📞 {order.shippingAddress?.phone}</p>
                              </div>
                            </div>

                            {/* Status Update */}
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Update Progress</p>
                              <div className="grid grid-cols-2 gap-2 mb-6">
                                {statusSteps.map((step) => (
                                  <button
                                    key={step}
                                    onClick={() => updateStatus(order._id, step)}
                                    disabled={updateStatusMutation.isPending}
                                    className={`px-3 py-3 rounded-xl text-xs font-semibold capitalize transition-all border shadow-sm flex items-center justify-center gap-2 ${
                                      order.orderStatus === step ?
                                      "gradient-gold text-primary-foreground border-transparent ring-2 ring-primary/20" :
                                      "bg-background text-muted-foreground hover:border-primary/50"
                                    }`}
                                  >
                                    {step}
                                    {updateStatusMutation.isPending && updateStatusMutation.variables?.status === step && (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    )}
                                  </button>
                                ))}
                              </div>

                              <div className="space-y-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline Visualization</p>
                                <div className="flex items-center gap-2">
                                  {statusSteps.map((step, i) => {
                                    const currentIdx = statusSteps.indexOf(order.orderStatus);
                                    const completed = i <= currentIdx;
                                    return (
                                      <div key={step} className="flex items-center flex-1">
                                        <div 
                                          className={`w-4 h-4 rounded-full border-4 ${
                                            completed ? "border-primary bg-primary shadow-[0_0_8px_rgba(234,179,8,0.4)]" : "border-muted bg-muted"
                                          } transition-all duration-500`} 
                                          title={step}
                                        />
                                        {i < statusSteps.length - 1 && (
                                          <div className={`flex-1 h-1 mx-1 rounded-full ${i < currentIdx ? "bg-primary" : "bg-muted"} transition-all duration-700`} />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex justify-between text-[10px] font-medium text-muted-foreground/60 uppercase">
                                  <span>{statusSteps[0]}</span>
                                  <span>{statusSteps[statusSteps.length - 1]}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;