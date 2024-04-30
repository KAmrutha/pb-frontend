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
  chakra
} from "@chakra-ui/react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
  Text,
  Flex
} from "@chakra-ui/react"
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { SnackbarProvider,enqueueSnackbar } from 'notistack'; // Import useSnackbar
import { useAuth } from '../ContextAPI/Authentication';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack'; // Import useSnackbar
import { useBudget } from "../ContextAPI/Budget";
import {PropagateLoader} from 'react-spinners'

export default function AddBudget() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addCategory, budget, removeCategory, fetchInitialBudget } = useBudget();
  const [categoryName, setCategoryName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const handleAddCategory = async () => {
    setLoading(true); // Set loading to true
    try {
      await addCategory({ name: categoryName, amount: allocatedAmount });
      //enqueueSnackbar('Category added successfully', { variant: 'success' }); // Show success message
      onClose();
    } catch (error) {
      console.error(error);
     // enqueueSnackbar('Category not added', { variant: 'error' }); // Show error message
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
    setCategoryName('');
    setAllocatedAmount('');
  };
  const [pageload,setPageLoad] = useState(true)

  const navigate = useNavigate();
  const { isLoggedin } = useAuth();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const format = (val) => `$` + val;
  const parse = (val) => val.replace(/^\$/, "");

  const [value, setValue] = React.useState("1.53");

//   const budgets = [
//     { category: 'Food', allocatedAmount: '100', id: 1 },
//     { category: 'Transportation', allocatedAmount: '200', id: 2 },
//     { category: 'Utilities', allocatedAmount: '150', id: 3 },
//   ];
  useEffect(()=>{
    const resetBudget = async () => {
        await fetchInitialBudget();
      setPageLoad(false);
       
      };
  
      resetBudget();
    if (!isLoggedin()) {
        enqueueSnackbar('Please login first', { variant: 'error' }); // Using enqueueSnackbar to show error message
        navigate('/signin');
    }
  }, [isLoggedin, enqueueSnackbar, navigate]); // Corrected useEffect dependencies

  const handleDeleteBudget = (id) => {
    // Implement delete budget functionality here
    console.log("Deleting budget with id:", id);
  };

  return (
    pageload? <PropagateLoader 
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
    <SnackbarProvider>
      <Flex justifyContent="space-between" p={5}>
        <chakra.h3 fontSize="xl" fontWeight="bold" textAlign="left">
          Total Expenditure
        </chakra.h3>
        <Button onClick={onOpen} colorScheme="teal" variant="solid" mb={4} ml="auto">
          Add <chakra.span ml={2}><AddIcon /></chakra.span>
        </Button>
      </Flex>

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
              <FormLabel>Category name</FormLabel>
              <Input ref={initialRef} placeholder="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Allocate Budget Amount</FormLabel>
              <NumberInput
                value={allocatedAmount}
                onChange={(valueString) => setAllocatedAmount(parse(valueString))}
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
            <Button colorScheme="blue" mr={3} isLoading={loading} loadingText="Creating" onClick={handleAddCategory}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div>
        <TableContainer boxShadow="lg">
          <Table variant='striped' colorScheme='green' borderWidth="1px" borderRadius="md">
            <TableCaption>Add Budget Categories here.</TableCaption>
            <Thead>
              <Tr>
                <Th>Budget Category</Th>
                <Th>Allocated Amount</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {budget.categories.map((budget) => (
                <Tr key={budget.name}>
                  <Td>{budget.name}</Td>
                  <Td>{budget.allocatedAmount}</Td>
                  <Td>
                    <IconButton
                      aria-label="Delete Budget"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeCategory(budget._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total</Th>
                <Th>{budget.categories.reduce((acc, curr) => acc + parseInt(curr.allocatedAmount), 0)}</Th>
                <Th></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </div>
      </SnackbarProvider>
    </>
  );
}
