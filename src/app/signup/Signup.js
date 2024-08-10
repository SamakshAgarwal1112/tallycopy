"use client";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/AuthStore";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
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

  function isComplete() {
    return userData["userName"] && userData["email"] && userData["password"];
  }

  async function handleSignup() {
    setLoading(true);
    const { email, userName, password } = userData;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (!data.user || !data.user.id) {
        throw new Error("User creation failed");
      }

      const uid = data.user.id;

      const { err } = await supabase
        .from("Users")
        .insert([{ uid: uid, user_handle: userName }]);

      if (err) {
        throw err;
      }

      toast({
        position: "top",
        status: "success",
        title: "Welcome back!",
        variant: "subtle",
        description: "redirecting to practice page...",
        isClosable: true,
        duration: 2500,
      });

      addAuth();
      setUserName(userName);
      setUserId(uid);

      setTimeout(() => {
        router.push("/practice");
      }, 1000);
    } catch (error) {
      toast({
        position: "top",
        status: "error",
        title: "Signup failed",
        description: error.message || "An unknown error occurred",
        isClosable: true,
        duration: 2500,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSignup();
  }

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} bgColor={"#111111"} borderRadius={"20px"}>
        <Heading fontSize={"4xl"} textAlign={"center"}>
          Sign up
        </Heading>
        <Box rounded={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id="userName" isRequired>
              <FormLabel>User Name</FormLabel>
              <Input
                type="text"
                _focusVisible={{ borderColor: "green.500" }}
                name="userName"
                value={userData["userName"] || ""}
                onChange={onChange}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                _focusVisible={{ borderColor: "green.500" }}
                name="email"
                value={userData["email"] || ""}
                onChange={onChange}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  _focusVisible={{ borderColor: "green.500" }}
                  name="password"
                  value={userData["password"] || ""}
                  onChange={onChange}
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
            <Stack spacing={10} pt={2}>
              <Button
                size="lg"
                bg={"green.300"}
                _hover={{ bg: "green.500", color: "white" }}
                isDisabled={!isComplete()}
                onClick={handleSubmit}
              >
                {loading ? <Spinner /> : "Sign up"}
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already a user?{" "}
                <Link href={"/login"} style={{ color: "#0180f1" }}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Signup;
