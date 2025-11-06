import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseStats } from "@/components/ExpenseStats";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  const fetchExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      setLoading(false);
      fetchExpenses();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email}
              </p>
            </div>
            <AddExpenseDialog onExpenseAdded={fetchExpenses} />
          </div>

          {loadingExpenses ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading expenses...</p>
            </div>
          ) : (
            <>
              <ExpenseStats expenses={expenses} />
              <ExpenseList expenses={expenses} onExpenseDeleted={fetchExpenses} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
