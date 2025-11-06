import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
  created_at: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

export const ExpenseList = ({ expenses, onExpenseDeleted }: ExpenseListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      toast.success("Expense deleted successfully");
      onExpenseDeleted();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No expenses yet. Start tracking by adding your first expense!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.expense_date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {expense.category}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {expense.description || "-"}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    disabled={deletingId === expense.id}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
