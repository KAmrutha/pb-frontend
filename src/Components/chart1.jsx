import React from 'react';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useBudget } from '../ContextAPI/Budget';
const data = [
  { category: 'Food', date: '2024-04-01', expense: 400, description: 'Groceries' },
  { category: 'Transportation', date: '2024-04-05', expense: 300, description: 'Fuel' },
  { category: 'Entertainment', date: '2024-04-10', expense: 200, description: 'Movie tickets' },
  { category: 'Utilities', date: '2024-04-15', expense: 500, description: 'Electricity bill' },
  // Add more data as needed
];

const Visualization = () => {
  // Total expenses
  const {budget} = useBudget();
  console.log('exp',budget.expenses)
  const totalExpenses = data.reduce((acc, item) => acc + item.expense, 0);

  // Average daily expenses
  const firstDate = new Date(data[0].date);
  const lastDate = new Date(data[data.length - 1].date);
  const totalDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  const averageDailyExpense = totalExpenses / totalDays;

  // Maximum and minimum expenses
  const maxExpense = Math.max(...data.map(item => item.expense));
  const minExpense = Math.min(...data.map(item => item.expense));

  // Most expensive category
  const expenseByCategory = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.expense;
    return acc;
  }, {});
  const mostExpensiveCategory = Object.keys(expenseByCategory).reduce((a, b) => expenseByCategory[a] > expenseByCategory[b] ? a : b);

  // Expense distribution by category
  const categoryDistribution = Object.entries(expenseByCategory).map(([category, expense]) => ({
    category,
    expense,
    percentage: (expense / totalExpenses) * 100
  }));

  return (
    <div>
      <div>
        <h2>Category-wise Expenses Pie Chart</h2>
        <PieChart width={400} height={300}>
          <Pie dataKey="expense" data={data} cx={200} cy={150} outerRadius={100} fill="#8884d8" label />
          <Tooltip />
        </PieChart>
      </div>
      <div>
        <h2>Monthly Expenses Line Chart</h2>
        {/* Add code for monthly expenses visualization */}
      </div>
      <div>
        <h2>Yearly Expenses Bar Chart</h2>
        {/* Add code for yearly expenses visualization */}
      </div>
      <div>
        <h2>Expense Trends Line Chart</h2>
        {/* Add code for expense trends visualization */}
      </div>
      <div>
        <h2>Statistics:</h2>
        <p>Total Expenses: ${totalExpenses}</p>
        <p>Average Daily Expenses: ${averageDailyExpense.toFixed(2)}</p>
        <p>Maximum Expense: ${maxExpense}</p>
        <p>Minimum Expense: ${minExpense}</p>
        <p>Most Expensive Category: {mostExpensiveCategory}</p>
        <h3>Expense Distribution by Category:</h3>
        <ul>
          {categoryDistribution.map(category => (
            <li key={category.category}>
              {category.category}: ${category.expense} ({category.percentage.toFixed(2)}%)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Visualization;
