'use client'
import React, { ReactNode,useEffect } from 'react'
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react'
import {  FiLogOut } from 'react-icons/fi';

import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from 'react-icons/fi'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import Visulization from './Visulization';
import { IconType } from 'react-icons'
import { ReactText } from 'react'
import { ToastContainer } from "react-toastify";
import AddExpense from './AddExpense';
import AddBudget from './AddBudget'
import Dashboard from './Dashboard';
import Signup from './signup';
import Footer from './Footer'

import { useAuth } from "../ContextAPI/Authentication";
const tokenRefreshTime=30_000;
const LinkItems= [
  { name: 'Home', icon: FiHome ,to:'homepage'},
  {name:'Dashboard',icon:FiStar,to:'dashboard'},
  { name: 'Add Expense', icon: FiTrendingUp ,to:'expense'},
  { name: 'AddBudget', icon: FiCompass ,to:'budget'},
  // { name: 'Favourites', icon: FiStar },
  // { name: 'Settings', icon: FiSettings },
]

export default function SimpleSidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isLoggedin, logout, refreshToken } = useAuth();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isLoggedin()) {
        refreshToken();
      }
    }, tokenRefreshTime);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [isLoggedin, refreshToken]);

  return ( 
          
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
    
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
     <Routes>
           <Route path="/expense" element={<AddExpense />} />
          <Route path="/budget" element={<AddBudget />} />
          <Route path="/dashboard" element={<Visulization />} />
          <Route path="/homepage" element={<Dashboard />} />

          <Route path="*" element={<Dashboard />} /> 

        </Routes>
        
        <ToastContainer />
      </Box>
      
    </Box>
  )
}


const SidebarContent = ({ onClose, ...rest }) => {
  const { isLoggedin, logout, refreshToken } = useAuth();

  const navigate = useNavigate();
const handleLogout=()=>{
  logout();
    window.location.reload();
    navigate("/signin");
}
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Budget Master
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <Link to={`/${link.to}`}>
           <NavItem key={link.name} icon={link.icon}>
         {link.name}
        </NavItem>
                </Link>
      ))}
      <NavItem icon={FiLogOut} key='lgout' onClick={handleLogout}>
         logout
        </NavItem>
    </Box>
  )
}


const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
       Budget Manager 
      </Text>
    </Flex>
  )
}