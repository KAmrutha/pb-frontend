import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Button,
  FormControl,
  Input,
  FormLabel,
  NumberInput,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  Select,
  Container,
  chakra,
  Flex,
  Divider,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  useColorModeValue
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import Stats from "./Stats";
import { useBudget } from '../ContextAPI/Budget';
import { useAuth } from '../ContextAPI/Authentication';
import { useSnackbar } from 'notistack'; // Import useSnackbar
import {PropagateLoader} from 'react-spinners'


export default function AddExpense() {
  const { addExpense, budget, removeExpense, fetchInitialBudget } = useBudget();

  const navigate = useNavigate();
  const { isLoggedin } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('gray.300', 'gray.600');
  const bgBar = 'blue.400';
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const format = (val) => `$` + val;
  const parse = (val) => val.replace(/^\$/, "");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [value, setValue] = React.useState("1.53");
  const { enqueueSnackbar } = useSnackbar(); // Destructure enqueueSnackbar from useSnackbar
  const [loading, setLoading] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Add your code to handle the selected date
  };
    const [pageload,setPageLoad] = useState(true)
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  
  useEffect(() => {
    if (!isLoggedin()) {
      enqueueSnackbar('Please login first', { variant: 'error' }); // Using enqueueSnackbar to show error message
      navigate('/signin');
      
    }
    const resetBudget = async () => {
      await fetchInitialBudget();
      setPageLoad(false);
    };
    resetBudget();
  }, [isLoggedin, enqueueSnackbar, navigate]); // Corrected useEffect dependencies

  const handleAddExpense = async () => {
    if (!selectedCategory) {
      alert('Please select a category for the expense.');
      return;
    }
    setLoading(true);
    const formattedDate = new Date(expenseDate).toISOString();
    
    try {
      const success = await addExpense({
        description: expenseName,
        amount: expenseAmount,
        categoryId: selectedCategory,
        date: formattedDate,
      });

      if (success) {
        setExpenseName('');
        setExpenseAmount('');
        setExpenseDate(new Date().toISOString().split('T')[0]);
        setSelectedCategory(budget.categories[0]?._id || '');
      //  enqueueSnackbar('Expense added successfully', { variant: 'success' });
        onClose();
      } else {
        enqueueSnackbar('Failed to add expense', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to add expense', { variant: 'error' });
    }
    setLoading(false);
  };

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
  />:
    <>
      <Stats/>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Budget Categories</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Expense Description</FormLabel>
              <Input ref={initialRef} placeholder="Expense description" value={expenseName} onChange={(e)=>setExpenseName(e.target.value)}  />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Expense Date</FormLabel>
              <Input type="date"  value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}  />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Choose Category</FormLabel>
              <Select placeholder="Select Category"  value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)} >
              {budget.categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Allocate Budget Amount</FormLabel>
              <NumberInput
                onChange={(valueString) => setExpenseAmount(parse(valueString))}
                value={format(expenseAmount)}
            
                min={0} 
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddExpense}   mr={3} isLoading={loading}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Container maxW="100%" py={12} px={4}>
        <Box border="1px solid" borderColor="gray.400" rounded="md" boxShadow="lg" overflow="hidden">
          <Flex justifyContent="space-between" p={5}>
            <chakra.h3 fontSize="xl" fontWeight="bold" textAlign="left">
              Total Expenditure
            </chakra.h3>
            <Button onClick={onOpen}>Add Expense</Button>
          </Flex>
          <Divider />
          <TableContainer>
            <Table size="md">
              <Thead>
                <Tr fontWeight="900">
                  <Th>Description</Th>
                  <Th>Category</Th>
                  <Th>Date</Th>
                  <Th>Amount Spent</Th>
                
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {budget.expenses.map((exp, index) => (
                  <Tr key={exp._id}>
                    <Td fontSize="sm">{exp.description}</Td>
                    <Td fontSize="sm">{exp.categoryName}</Td>
                    <Td fontSize="sm">
                    {new Date(exp.date).toLocaleDateString()}
                    </Td>
                    <Td fontSize="sm">
                     $ {exp.amount}
                    </Td>
                   
                    
                    <Td fontSize="sm">
                      <Button size="sm"  onClick={() => removeExpense(exp._id)} >Delete</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
}
