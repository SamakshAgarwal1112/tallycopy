"use client";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../../utils/supabase"
import { useRouter } from "next/navigation";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const toast = useToast();
  const router = useRouter();

  function onChange(e) {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleLogin();
  }

  async function handleLogin() {
    const { email, password } = userData;
    try {
      const { _, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      toast({
        status: "success",
        title: "Login Successful",
        isClosable: true,
        duration: 2500,
      });
      setTimeout(() => {
        router.push("/practice");
      }, 1000);
    } catch (error) {
      toast({
        status: "error",
        title: "Login Failed",
        variant: "subtle",
        isClosable: true,
        duration: 2500,
      });
    }
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Log in
        </Heading>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                value={userData["email"]}
                onChange={onChange}
                _focusVisible={{
                  borderColor: "primary.500",
                }}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userData["password"]}
                  onChange={onChange}
                  _focusVisible={{
                    borderColor: "primary.500",
                  }}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Text color={"blue"}>Forgot password?</Text>
              <Button
                bg={"accent.main"}
                _hover={{
                  bg: "accent.500",
                  color: "white",
                }}
                onClick={handleSubmit}
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
