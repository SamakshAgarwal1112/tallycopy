"use client";
import { Box, Button, Flex, Text, Avatar } from "@chakra-ui/react";
import Link from "next/link";
import useAuthStore from "@/store/AuthStore";
function Navbar() {
  const { isAuth } = useAuthStore((state) => ({
    isAuth: state.isAuth,
  }));

  return (
    <Flex
      position="sticky"
      top={0}
      zIndex="1"
      width="100%"
      backgroundColor="#0D1418"
      color="white"
      p={4}
      justify="space-between"
      align="center"
    >
      <Flex marginLeft="1rem">
        <Link href="/practice">
          <Text color="white">Practice</Text>
        </Link>
      </Flex>

      {isAuth ? (
        <Avatar
          marginRight="1rem"
          name="Dan Abrahmov"
        />
      ) : (
        <Flex gap="1rem" marginRight="1rem">
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>

          <Link href="/login">
            <Button
              bg={"green.300"}
              _hover={{ bg: "green.500", color: "white" }}
            >
              Login
            </Button>
          </Link>
        </Flex>
      )}
    </Flex>
  );
}

export default Navbar;
