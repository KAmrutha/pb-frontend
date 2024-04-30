'use client'

import {
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react'
import { ReactNode,useEffect,useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import { FiServer } from 'react-icons/fi'
import { GoLocation } from 'react-icons/go'
import { FiDollarSign } from 'react-icons/fi';
import { RiExchangeDollarLine } from 'react-icons/ri';
import {enqueueSnackbar } from 'notistack'
import { BiCalculator } from 'react-icons/bi';

import { useAuth } from '../ContextAPI/Authentication';
import { useBudget } from '../ContextAPI/Budget';
import { useNavigate } from 'react-router-dom';
function StatsCard(props) {
    const navigate = useNavigate();
    const { isLoggedin } = useAuth();
    useEffect(()=>{
        if (!isLoggedin()) {
            enqueueSnackbar('Please login first', { variant: 'error' }); // Using enqueueSnackbar to show error message
            navigate('/signin');
        }
      }, [isLoggedin, enqueueSnackbar, navigate]); // Corrected useEffect dependencies
    







  const { title, stat, icon } = props
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  )
}

export default function BasicStatistics() {
    
    const { addExpense, budget, removeExpense, fetchInitialBudget } = useBudget();
    const [totalBudget,setTotalBudget] = useState(0);
    const [totalExpenses,setTotalExpenses] = useState(0);
    const [totalTransaction,setTotalTransaction] = useState(0);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    useEffect(() => {
        let tBudget = 0;
        let tExpenses = 0;
        let tTransaction=0;
        budget.categories.forEach((category) => {
          tBudget += parseInt(category.allocatedAmount);
          
        });
        budget.expenses.forEach((expense) => {
            //tExpenses += parseInt(expense.amount);
            let  expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear) {
        tExpenses += parseInt(expense.amount);
        tTransaction++;
      }
          });
        setTotalBudget(tBudget);
        setTotalExpenses(tExpenses);
        setTotalTransaction(tTransaction);
      }, [budget]);
  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1 textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
        Manage your budget, like never before
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard title={'Total Budget'} stat={totalBudget} icon={<BiCalculator size={'3em'} />} />
        <StatsCard title={'Total Expense (current month)'} stat={totalExpenses} icon={<FiDollarSign size={'3em'} />} />
        <StatsCard title={'Total Transaction (current month)'} stat={totalTransaction} icon={<RiExchangeDollarLine size={'3em'} />} />
      </SimpleGrid>
    </Box>
  )
}