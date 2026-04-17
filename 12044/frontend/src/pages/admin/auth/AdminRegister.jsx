import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // Explicitly set role for admin registration
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      toast({ title: "Admin registered successfully!", description: "You now have access to the dashboard." });
      navigate("/admin");
    } catch (error) {
      toast({ variant: "destructive", title: "Registration failed", description: error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">New Administrator</h1>
          <p className="text-muted-foreground">Register an admin account to manage the Bazzarly system.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Admin Name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input id="email" type="email" placeholder="admin@bazzarly.com" value={formData.email} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Security Password</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating admin account..." : "Register Administrator"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already an admin? </span>
          <Link to="/admin/login" className="text-primary hover:underline font-semibold">Sign in</Link>
        </div>
        <div className="mt-4 text-center">
           <Link to="/" className="text-xs text-muted-foreground hover:text-foreground underline">Back to Store</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
