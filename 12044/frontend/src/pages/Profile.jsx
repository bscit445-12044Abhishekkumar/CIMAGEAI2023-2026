import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/axios";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast({ variant: "destructive", title: "Error", description: "Passwords do not match." });
    }

    setIsLoading(true);
    try {
      const { data } = await api.put("/users/profile", formData);
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
      // Update local storage and context if necessary
      localStorage.setItem("user", JSON.stringify(data));
      // Note: we might need a way to update the user in the AuthContext if it's not being updated automatically
    } catch (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.response?.data?.message || "An error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-8">My Profile</h1>
        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Account Role</Label>
                <Input value={user?.role || "user"} disabled className="capitalize" />
              </div>
            </div>
            
            <div className="border-t pt-6 mt-6">
              <h2 className="text-lg font-bold mb-4">Change Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" type="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full md:w-auto px-8" disabled={isLoading}>
              {isLoading ? "Saving changes..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
