import React from 'react';
import CategoryPieChart from './PieChart';
import MonthlyLineChart from './LineChart';
import WeeklyBarChart from './BarChart';
import { Flex, Box, Heading } from '@chakra-ui/react';

const VisualizationContainer = ({ budget }) => {

  const { expenses } = budget;

  // Total expenses
  const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0);

  // Average daily expenses
  const firstDate = new Date(expenses[0].date);
  const lastDate = new Date(expenses[expenses.length - 1].date);
  const totalDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  const averageDailyExpense = totalExpenses / totalDays;

  // Maximum and minimum expenses
  const maxExpense = Math.max(...expenses.map(item => item.amount));
  const minExpense = Math.min(...expenses.map(item => item.amount));

  // Most expensive category
  const expenseByCategory = expenses.reduce((acc, item) => {
    acc[item.categoryName] = (acc[item.categoryName] || 0) + item.amount;
    return acc;
  }, {});
  const mostExpensiveCategory = Object.keys(expenseByCategory).reduce((a, b) => expenseByCategory[a] > expenseByCategory[b] ? a : b);

  // Expense distribution by category
  const totalAmount = Object.values(expenseByCategory).reduce((a, b) => a + b);
  const categoryDistribution = Object.entries(expenseByCategory).map(([categoryName, amount]) => ({
    categoryName,
    amount,
    percentage: (amount / totalAmount) * 100
  }));

  // Monthly expenses
  const monthlyExpenses = expenses.reduce((acc, item) => {
    const month = new Date(item.date).getMonth() + 1;
    acc[month] = (acc[month] || 0) + item.amount;
    return acc;
  }, {});

  const monthlyChartData = Object.keys(monthlyExpenses).map(month => ({
    month: Number(month),
    amount: monthlyExpenses[month]
  }));

  // Week wise expenses
  const weekWiseExpenses = expenses.reduce((acc, item) => {
    const week = Math.ceil((new Date(item.date) - firstDate) / (1000 * 60 * 60 * 24 * 7));
    acc[week] = (acc[week] || 0) + item.amount;
    return acc;
  }, {});

  const weeklyChartData = Object.keys(weekWiseExpenses).map(week => ({
    week: Number(week),
    amount: weekWiseExpenses[week]
  }));

  return (
    <Flex>
      <Box flex="1" p={5}>
        <Box mb={5}>
          <Heading as="h3" size="md" mb={3}>Weekly Expenses</Heading>
          <WeeklyBarChart data={weeklyChartData} />
        </Box>
        <Box>
          <Heading as="h3" size="md" mb={3}>Monthly Expenses</Heading>
          <MonthlyLineChart data={monthlyChartData} />
        </Box>
      </Box>
      <Box flex="1" p={5}>
        <Box>
          <Heading as="h3" size="md" mb={3}>Category-wise Expenses</Heading>
          <CategoryPieChart data={categoryDistribution} />
        </Box>
      </Box>
    </Flex>
  );
};

export default VisualizationContainer;
