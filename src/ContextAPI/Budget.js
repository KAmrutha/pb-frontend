import React, { createContext, useContext, useState, useEffect } from 'react';
import Axios from './Request';
import { useSnackbar } from 'notistack';

const BudgetContext = createContext();

export const useBudget = () => {
  return useContext(BudgetContext);
};

export const BudgetContextProvider = ({ children }) => {
  const [budget, setBudget] = useState({
    id: '',
    name: '',
    amount: 0,
    categories: [],
    expenses: [],
    sortedExpenses: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  const addCategory = async (category) => {
    try {
      const response = await Axios.post('/budget/addCategoryToBudget', {
        budgetId: budget.id,
        name: category.name,
        allocatedAmount: category.amount
      });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      fetchInitialBudget();
      return true;
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Cannot add category', { variant: 'error' });
      return false;
    }
  };

  const addExpense = async (expense) => {
    try {
      const response = await Axios.post('/budget/addExpense', {
        description: expense.description,
        amount: expense.amount,
        categoryId: expense.categoryId,
        date: expense.date
      });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      fetchInitialBudget();
      return true;
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Cannot add expense', { variant: 'error' });
      return false
    }
  };

  const removeCategory = async (id) => {
    try {
      const response = await Axios.post('/budget/deleteCategory', {
        categoryId: id,
      });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      fetchInitialBudget();
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Cannot remove category', { variant: 'error' });
    }
    const newCategories = budget.categories.filter((category) => {
      return category._id !== id;
    });
    setBudget((prevBudget) => ({
      ...prevBudget,
      categories: newCategories,
    }));
  };

  const removeExpense = async (id) => {
    try {
      const response = await Axios.post('/budget/deleteExpense', {
        expenseId: id,
      });
      enqueueSnackbar(response.data.message, { variant: 'success' });
      fetchInitialBudget();
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Cannot remove expense', { variant: 'error' });
    }
    const newExpenses = budget.expenses.filter((expense) => {
      return expense._id !== id;
    });
    setBudget((prevBudget) => ({
      ...prevBudget,
      expenses: newExpenses,
    }));
  };

  const fetchInitialBudget = async () => {
    try {
      const response = await Axios.get('/budget/getAllBudgets');
      let expenses = await Axios.get('/budget/getAllUserExpense');
      let sortedExpenses = await Axios.get('/budget/getAllUserExpensesSortedByDate');
      expenses = expenses.data;
      const data = response.data;
      sortedExpenses = sortedExpenses.data;
      if (data[0]) {
        setBudget({
          id: data[0]._id,
          name: data[0].name,
          amount: data[0].totalAmount,
          categories: data[0].categories,
          expenses: expenses,
          sortedExpenses: sortedExpenses
        });
      } else {
        enqueueSnackbar('Creating your first budget ...', { variant: 'info' });
        try {
          const today = new Date();
          const startDate = today;
          const endDate = new Date(today);
          endDate.setDate(today.getDate() + 30);
          const response = await Axios.post('/budget/addBudget', {
            name: 'My Budget',
            totalAmount: 25000,
            startDate: startDate,
            // enddate should be after 30 days
            endDate: endDate,
          });
          enqueueSnackbar(response.data.message, { variant: 'success' });
          fetchInitialBudget();
        } catch (err) {
          console.log(err);
          enqueueSnackbar('Cannot create budget', { variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Error fetching initial budget:', error.message);
      enqueueSnackbar('Error fetching initial budget: ' + error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchInitialBudget();
  }, []);

  return (
    <BudgetContext.Provider value={{ budget, addCategory, addExpense, removeExpense, removeCategory, fetchInitialBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};
