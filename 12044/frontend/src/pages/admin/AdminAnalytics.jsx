import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell } from
"recharts";
import { salesData, mockOrders } from "@/data/admin";
import { products } from "@/data/products";

const categoryData = products.reduce((acc, p) => {
  const found = acc.find((c) => c.name === p.category);
  if (found) found.count++;else
  acc.push({ name: p.category, count: 1 });
  return acc;
}, []);

const PIE_COLORS = [
"hsl(36, 60%, 52%)",
"hsl(36, 60%, 40%)",
"hsl(30, 30%, 60%)",
"hsl(30, 15%, 75%)",
"hsl(30, 10%, 45%)"];


const ordersByStatus = mockOrders.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] || 0) + 1;
  return acc;
}, {});
const statusData = Object.entries(ordersByStatus).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));

const AdminAnalytics = () =>
<div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold">Analytics</h1>
      <p className="text-sm text-muted-foreground">Sales performance and insights.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-body text-sm font-semibold mb-4">Monthly Revenue</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(36, 60%, 52%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(36, 60%, 52%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(30, 8%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(30, 8%, 50%)" tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(36, 60%, 52%)" strokeWidth={2} fill="url(#rGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-body text-sm font-semibold mb-4">Monthly Orders</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(30, 8%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(30, 8%, 50%)" />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(36, 60%, 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-body text-sm font-semibold mb-4">Products by Category</h2>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) =>
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Status */}
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h2 className="font-body text-sm font-semibold mb-4">Orders by Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(30, 8%, 50%)" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="hsl(30, 8%, 50%)" width={110} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(36, 60%, 52%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>;


export default AdminAnalytics;