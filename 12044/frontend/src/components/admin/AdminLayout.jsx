import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  ArrowLeft,
  Menu,
  LogOut,
  X } from
"lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
{ to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
{ to: "/admin/products", icon: Package, label: "Products" },
{ to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
{ to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
{ to: "/admin/customers", icon: Users, label: "Customers" }];


const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path, end) =>
  end ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-foreground text-background flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
        }>
        
        <div className="flex items-center justify-between h-16 px-6 border-b border-background/10">
          <Link to="/admin" className="font-heading text-xl font-bold">Bazzarly</Link>
          <button className="lg:hidden text-background/60" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) =>
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive(to, end) ?
            "bg-primary text-primary-foreground" :
            "text-background/60 hover:text-background hover:bg-background/10"}`
            }>
            
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-background/10">
          <button
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-background/50 hover:text-background transition-colors mt-2">
            
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen &&
      <div className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      }

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 h-14 bg-background border-b flex items-center px-4 lg:px-6">
          <button className="lg:hidden p-2 text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-muted-foreground ml-2 lg:ml-0">Admin Panel</span>
        </header>
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>);

};

export default AdminLayout;