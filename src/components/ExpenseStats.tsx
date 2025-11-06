import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  expense_date: string;
}

interface ExpenseStatsProps {
  expenses: Expense[];
}

export const ExpenseStats = ({ expenses }: ExpenseStatsProps) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = expenses
    .filter((expense) => {
      const date = new Date(expense.expense_date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleString("default", { month: "long" })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategory ? topCategory[0] : "N/A"}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategory ? `$${topCategory[1].toFixed(2)}` : "No expenses yet"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
