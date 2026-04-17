import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, UserPlus, Shield, ShieldAlert, Trash2, Mail, Phone, Calendar, RefreshCw, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";

const AdminCustomers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await api.get("/admin/users");
      return data;
    }
  });

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ id, newRole }) => {
      const { data } = await api.patch(`/admin/user/${id}`, { role: newRole });
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["admin-users"], (old) =>
        old.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
      toast.success(`User role updated to ${updatedUser.role}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/user/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["admin-users"], (old) =>
        old.filter((u) => u._id !== deletedId)
      );
      toast.success("User account deleted permanently");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  });

  const handleToggleRole = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    const confirmMsg = `Are you sure you want to ${newRole === "admin" ? "promote" : "demote"} ${user.name} to ${newRole}?`;
    if (window.confirm(confirmMsg)) {
      toggleRoleMutation.mutate({ id: user._id, newRole });
    }
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`WARNING: Are you sure you want to PERMANENTLY delete account "${name}"? This action cannot be undone.`)) {
      deleteUserMutation.mutate(id);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-primary" />
        <p className="font-medium">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Customer Directory</h1>
          <p className="text-sm text-muted-foreground">{users.length} registered accounts in the system</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full md:w-64 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b bg-muted/30">
                <th className="px-6 py-5">Customer Profile</th>
                <th className="px-6 py-5">Role & Access</th>
                <th className="px-6 py-5">Contact Details</th>
                <th className="px-6 py-5">Member Since</th>
                <th className="px-6 py-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted-foreground italic">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-muted/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm border ${
                          u.role === "admin" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-primary/10 text-primary border-primary/20"
                        }`}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">{u.name}</p>
                          <p className="text-[10px] flex items-center gap-1 text-muted-foreground mt-0.5">
                            ID: {u._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {u.role === "admin" ? (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200/50">
                            <Shield className="w-3 h-3" /> Admin
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200/50">
                            <ShieldAlert className="w-3 h-3" /> Standard User
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs flex items-center gap-1.5 text-foreground font-medium">
                          <Mail className="w-3 h-3 text-muted-foreground" /> {u.email}
                        </p>
                        {u.phone && (
                          <p className="text-[10px] flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="w-3 h-3" /> {u.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-medium flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleToggleRole(u)}
                          disabled={toggleRoleMutation.isPending}
                          className="p-2 rounded-xl text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-all border border-transparent hover:border-amber-100"
                          title={u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                        >
                          {u.role === "admin" ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          disabled={deleteUserMutation.isPending}
                          className="p-2 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                          title="Delete Account"
                        >
                          <Trash2 className="w-5 h-5" />
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

export default AdminCustomers;