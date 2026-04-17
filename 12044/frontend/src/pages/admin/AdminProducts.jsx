import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/api/axios";

const emptyForm = {
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
  stock: 10,
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newProduct) => api.post("/products", newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success("Product created successfully");
      setShowForm(false);
      setForm(emptyForm);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create product"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedFields }) =>
      api.put(`/products/${id}`, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success("Product updated successfully");
      setShowForm(false);
      setForm(emptyForm);
      setEditing(null);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update product"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete product"
      );
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title || "",
      price: p.price?.toString() || "",
      description: p.description || "",
      category: p.category?.name || p.category || "",
      image: p.images?.[0] || "",
      stock: p.stock || 0,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title || !form.price || !form.category) {
      toast.error("Please fill required fields");
      return;
    }

    const payload = {
      title: form.title,
      price: parseFloat(form.price),
      description: form.description,
      category: form.category,
      stock: parseInt(form.stock),
      images: form.image ? [form.image] : [],
    };

    if (editing) {
      updateMutation.mutate({
        id: editing._id,
        updatedFields: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <RefreshCw className="w-8 h-8 animate-spin mb-4" />
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">{products.length} products listed</p>
        </div>
        <Button onClick={openNew} className="gradient-gold text-primary-foreground border-0 rounded-lg font-body font-semibold">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border shadow-2xl w-full max-w-lg mx-4 p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-heading text-xl font-bold">{editing ? "Edit Product" : "New Product"}</h2>
                <p className="text-xs text-muted-foreground mt-1">Fill in the details to {editing ? "update" : "create"} the item</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Wireless Headphones"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    placeholder="2999"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Stock Level</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Category *</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Description</label>
                <textarea
                  placeholder="Tell customers more about this product..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 rounded-xl h-12">
                  Cancel
                </Button>
                <button
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-[2] gradient-gold text-primary-foreground border-0 rounded-xl font-body font-bold h-12 shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    editing ? "Update Product" : "Create Product"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b bg-muted/30">
                <th className="px-6 py-5">Product</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Stock Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground italic">
                    Your inventory is empty. Click "Add Product" to get started.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=700&fit=crop"}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover bg-muted border border-border/20 shadow-sm"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{p.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate w-40">{p.description?.slice(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {p.category?.name || p.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      ₹{p.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.stock > 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${p.stock > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {p.stock > 0 ? `${p.stock} In Stock` : "Out of Stock"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                          title="Edit Product"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50/50 transition-all border border-transparent hover:border-rose-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;