import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

// Status Colors aligned with backend enum: ["Processing", "Shipped", "Delivered", "Cancelled"]
const statusColor = {
  Processing: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700"
};

const AdminDashboard = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/stats");
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p className="font-medium">Synthesizing live analytics...</p>
      </div>
    );
  }

  const { totalRevenue = 0, totalOrders = 0, totalProducts = 0, totalCustomers = 0, recentOrders = [] } = statsData || {};

  const statsCards = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      change: "+Today Only",
      icon: DollarSign
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: "Live Tracking",
      icon: ShoppingCart
    },
    {
      label: "Products",
      value: totalProducts.toString(),
      change: "In Inventory",
      icon: Package
    },
    {
      label: "Registered Customers",
      value: totalCustomers.toString(),
      change: "User Growth",
      icon: Users
    }
  ];

  // Placeholder data for chart until we add historical analytics
  const chartData = [
    { month: "Jan", revenue: totalRevenue * 0.4 },
    { month: "Feb", revenue: totalRevenue * 0.6 },
    { month: "Mar", revenue: totalRevenue * 0.8 },
    { month: "Apr", revenue: totalRevenue }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Business Intelligence</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live data sync active
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map(({ label, value, change, icon: Icon }) => (
          <div key={label} className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all hover:border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground font-heading">{value}</p>
            <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm border-border/50">
          <h2 className="font-heading text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
            Revenue Trajectory
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(36, 60%, 52%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(36, 60%, 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "1rem",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "0.75rem"
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-border/50 flex flex-col">
          <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold flex items-center gap-2">
              Recent Transactions
            </h2>
            <a href="/admin/orders" className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all group">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/10 border-b">
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-12 text-center text-muted-foreground italic">
                      Waiting for transaction data...
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-foreground">ORDER-{order.id.slice(-4).toUpperCase()}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(order.date).toLocaleDateString("en-IN")}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-foreground">
                        ₹{order.total?.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;