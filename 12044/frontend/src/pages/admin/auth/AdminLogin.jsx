import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "admin") {
        toast({ variant: "destructive", title: "Access Denied", description: "This portal is for administrators only." });
        return;
      }
      toast({ title: "Admin Authenticated", description: "Welcome to the control center." });
      navigate("/admin");
    } catch (error) {
      toast({ variant: "destructive", title: "Login failed", description: error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background border shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-foreground p-8 text-background text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold tracking-tight">Admin Portal</h1>
          <p className="text-background/60 text-sm">Secure access for Bazzarly administrators only.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Administrative Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@bazzarly.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-muted/50 border-muted-foreground/20 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Security Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-muted/50 border-muted-foreground/20 focus:border-primary"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign into Dashboard"}
          </Button>
          
          <div className="text-center pt-4 border-t border-muted">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Return to Public Store
            </Link>
          </div>
          <div className="text-center text-xs text-muted-foreground/40 mt-4">
            <Link to="/admin/register" className="hover:text-primary underline">Request Admin Access</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
