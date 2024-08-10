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
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/AuthStore";
import Link from "next/link";
import getUserName from "@/app/api/getUserName";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const toast = useToast();
  const router = useRouter();

  const { addAuth, setUserName, setUserId } = useAuthStore((state) => ({
    addAuth: state.addAuth,
    setUserName: state.setUserName,
    setUserId: state.setUserId,
  }));

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

  function isComplete() {
    return userData["email"] && userData["password"];
  }

  async function handleLogin() {
    setLoading(true);
    const { email, password } = userData;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      toast({
        position: "top",
        status: "success",
        title: "Login Successful",
        variant: "subtle",
        description: "Redirecting to practice page...",
        isClosable: true,
        duration: 2500,
      });

      addAuth();

      let user = await getUserName(data.user.id);
      setUserName(user);
      setUserId(data.user.id);

      setTimeout(() => {
        router.push("/practice");
      }, 1000);
    } catch (error) {
      toast({
        position: "top",
        status: "error",
        title: "Login Failed",
        variant: "subtle",
        isClosable: true,
        duration: 2500,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} bgColor={"#111111"} borderRadius={"20px"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Log in
        </Heading>
        <Box rounded={"lg"} p={8}>
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
              <Text color={"#0180f1"}>Forgot password?</Text>
              <Button
                size="lg"
                bg={"green.300"}
                _hover={{ bg: "green.500", color: "white" }}
                isDisabled={!isComplete()}
                onClick={handleSubmit}
              >
                {loading ? <Spinner /> : "Log in"}
              </Button>
            </Stack>
          </Stack>
          <Stack pt={6}>
            <Text align={"center"}>
              Dont have an account?{" "}
              <Link href={"/signup"} style={{ color: "#0180f1" }}>
                Signup
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
