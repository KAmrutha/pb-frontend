"use client";
import React, { useState ,useEffect} from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "../ContextAPI/Authentication";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';

export default function SimpleCard() {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { isLoggedin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(()=>{
    if (isLoggedin()) {
        enqueueSnackbar('Already logged in', { variant: 'warning' }); // Using enqueueSnackbar to show error message
        navigate('/dashboard');
    }
  }, [isLoggedin, enqueueSnackbar, navigate]); // Corrected useEffect dependencies

  const handleLogin = async () => {
    // Validate username and password as needed
    try {
      await login({ email, password });
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error.message);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Don't have an account{" "}
            <Link
              to={"/signup"}
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {" "}
              Create Now!
            </Link>
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.400"}>Forgot password?</Text>
              </Stack>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleLogin}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
