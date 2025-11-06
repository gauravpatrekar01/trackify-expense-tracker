import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const isAuthPage = location.pathname === "/auth";
  const isDashboardPage = location.pathname === "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>Trackify</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {!isDashboardPage && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                {!isAuthPage && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate("/auth")}
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => navigate("/auth")}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
