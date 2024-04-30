import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisualizationContainer from "./VisulizationStats";
import LineChart1 from "./LineChart1";
import {
  Box,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Container,
  Flex,
  Button,
  Table,
  Tr,
  Th,
  Tbody,
  Td,
  Divider,
  TableContainer,
  Thead,
  useDisclosure,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { useAuth } from "../ContextAPI/Authentication";
import { useBudget } from "../ContextAPI/Budget";
import CategoryPieChart from "./PieChart";
import StackedBarChart from "./StackedBarChart";
import {PropagateLoader} from 'react-spinners'

const months = [
  { value: 0, label: "All Months" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];
export default function Visulization() {
  let bgcolor = useColorModeValue("gray.800", "gray.500");
  const navigate = useNavigate();
  const { isLoggedin } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const { budget, fetchInitialBudget } = useBudget();
  const [expenses, setExpenses] = useState(budget.expenses);
  const [filteredExpenses, setFilteredExpenses] = useState(budget.expenses);
  const [pageload,setPageLoad] = useState(true)
  
  const handleSelectMonth = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };
  useEffect(() => {
    const resetBudget = async () => {
      if (!isLoggedin()) {
        navigate("/login");
      }
      await fetchInitialBudget();
      setPageLoad(false);

    };
    resetBudget();
  }, [isLoggedin, navigate]);
useEffect(()=>{
      setExpenses(budget.expenses);
      setFilteredExpenses(budget.expenses);
},[budget.expenses])
  useEffect(() => {
    if (selectedMonth == 0) {
      setFilteredExpenses(expenses);
      return;
    } else {
      const filteredExpenses = expenses.filter(
        (expense) => new Date(expense.date).getMonth() + 1 === selectedMonth
      );
      setFilteredExpenses(filteredExpenses);
    }
    console.log(expenses);
  }, [selectedMonth]);

  if (
    !budget.expenses ||
    budget.expenses.length === 0 ||
    filteredExpenses.length == 0
  ) {
    return (
      <>
        <select onChange={handleSelectMonth} value={selectedMonth}>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
          <chakra.h1
            textAlign={"center"}
            fontSize={"4xl"}
            py={10}
            fontWeight={"bold"}
          >
            No Expense Found For Selected Month.
          </chakra.h1>
        </Box>
      </>
    ); // Render nothing if expenses array is empty
  }
  const totalExpenses = filteredExpenses.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  // Average daily expenses
  const firstDate = new Date(filteredExpenses[0].date);
  const lastDate = new Date(filteredExpenses[filteredExpenses.length - 1].date);
  const totalDays =
    Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  const averageDailyExpense = Math.abs(totalExpenses / totalDays);

  // Maximum and minimum expenses
  const maxExpense = Math.max(...filteredExpenses.map((item) => item.amount));

  const weeklyExpenses = getWeeklyExpenses(filteredExpenses);
  const expenseByCategory = filteredExpenses.reduce((acc, item) => {
    acc[item.categoryName] = (acc[item.categoryName] || 0) + item.amount;
    return acc;
  }, {});

  const categories = Object.keys(expenseByCategory).map((categoryName) => {
    const totalExpense = expenseByCategory[categoryName];
    const allocatedAmount = budget.categories.find(
      (category) => category.name === categoryName
    )?.allocatedAmount;
    return {
      categoryName,
      totalExpense,
      amountLeft: allocatedAmount - totalExpense,
    };
  });
  const mostExpensiveCategory = Object.keys(expenseByCategory).reduce((a, b) =>
    expenseByCategory[a] > expenseByCategory[b] ? a : b
  );
  // Expense distribution by category
  const totalAmount = Object.values(expenseByCategory).reduce((a, b) => a + b);
  const categoryDistribution = Object.entries(expenseByCategory).map(
    ([categoryName, amount]) => ({
      categoryName,
      amount,
      percentage: (amount / totalAmount) * 100,
    })
  );

  return (
    pageload?  <PropagateLoader 
    cssOverride={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '9999',
    }} 
    color="#36d7b7" 
  />: <>
      {" "}
      <select onChange={handleSelectMonth} value={selectedMonth}>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
        <chakra.h1
          textAlign={"center"}
          fontSize={"4xl"}
          py={10}
          fontWeight={"bold"}
        >
          Utilize the power of charts to present budget with precision and
          clarity.
        </chakra.h1>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
          <Stat
            px={{ base: 4, md: 8 }}
            py={"5"}
            shadow={"xl"}
            border={"1px solid"}
            borderColor={bgcolor}
            rounded={"lg"}
          >
            <StatLabel fontWeight={"medium"} isTruncated>
              Total Expenses
            </StatLabel>
            <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
              $ {totalExpenses}
            </StatNumber>
          </Stat>
          <Stat
            px={{ base: 4, md: 8 }}
            py={"5"}
            shadow={"xl"}
            border={"1px solid"}
            borderColor={bgcolor}
            rounded={"lg"}
          >
            <StatLabel fontWeight={"medium"} isTruncated>
              Average Daily Expenses
            </StatLabel>
            <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
              $ {averageDailyExpense.toFixed(2)}
            </StatNumber>
          </Stat>
          <Stat
            px={{ base: 4, md: 8 }}
            py={"5"}
            shadow={"xl"}
            border={"1px solid"}
            borderColor={bgcolor}
            rounded={"lg"}
          >
            <StatLabel fontWeight={"medium"} isTruncated>
              Maximum Expense
            </StatLabel>
            <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
              $ {maxExpense.toFixed(2)}
            </StatNumber>
          </Stat>
          <Stat
            px={{ base: 4, md: 8 }}
            py={"5"}
            shadow={"xl"}
            border={"1px solid"}
            borderColor={bgcolor}
            rounded={"lg"}
          >
            <StatLabel fontWeight={"medium"} isTruncated>
              Most Expensive Category
            </StatLabel>
            <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
              {mostExpensiveCategory}
            </StatNumber>
          </Stat>
        </SimpleGrid>
      </Box>
      <Flex>
        <Box
          maxW="7xl"
          flex="3"
          p={5}
          mx={"auto"}
          pt={0}
          px={{ base: 2, sm: 12, md: 17 }}
        >
          <Container maxW="100%" py={12} px={4}>
            <Box
              border="1px solid"
              borderColor="gray.400"
              rounded="md"
              boxShadow="lg"
              overflow="hidden"
            >
              <Flex justifyContent="space-between" p={5}>
                <chakra.h3 fontSize="xl" fontWeight="bold" textAlign="left">
                  Expense by Category
                </chakra.h3>
              </Flex>
              <Divider />
              <TableContainer>
                <Table size="md">
                  <Thead>
                    <Tr fontWeight="900">
                      <Th>Index</Th>
                      <Th>Category Name</Th>
                      <Th>Total Expenditure</Th>
                      <Th>Amount Left</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categories.map((category, index) => (
                      <Tr key={category.categoryName}>
                        <Td fontSize="sm">{index + 1}</Td>
                        <Td fontSize="sm">{category.categoryName}</Td>
                        <Td fontSize="sm">
                          ${category.totalExpense.toFixed(2)}
                        </Td>
                        <Td
                          fontSize="sm"
                          color={category.amountLeft >= 0 ? "green" : "red"}
                        >
                          ${category.amountLeft.toFixed(2)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>
        <Box flex="1" p={5}>
          <Box pt={10}>
            <Heading as="h3" size="md" mb={3}>
              Category-wise Expenses
            </Heading>
            <CategoryPieChart data={categoryDistribution} />
          </Box>
        </Box>
      </Flex>
        <Box  p={5}>
          <Box pt={10}>
            <Heading as="h3" size="md" mb={3}>
              Weekly Expenses
            </Heading>
            <LineChart1 data={weeklyExpenses} />
          </Box>
        </Box>
        <Box  p={5}>
          <Box pt={10}>
            <Heading as="h3" size="md" mb={3}>
              Budget-Expense Distribution
            </Heading>
            <StackedBarChart data={categories} />
          </Box>
        </Box>
     
    
    </>
  );
}

// Function to get weekly expenses
function getWeeklyExpenses(expenses) {
  const weeklyExpenses = [];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const weekStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - date.getDay()
    );
    const dayIndex = date.getDay();

    // Find the week index
    const weekIndex = Math.floor(
      (date - weekStart) / (7 * 24 * 60 * 60 * 1000)
    );

    // Initialize the week if it doesn't exist
    if (!weeklyExpenses[weekIndex]) {
      weeklyExpenses[weekIndex] = days.map((day) => ({ day, amount: 0 }));
    }

    // Add the expense amount to the corresponding day
    weeklyExpenses[weekIndex][dayIndex].amount += expense.amount;
  });

  return weeklyExpenses;
}

// Get weekly expenses
