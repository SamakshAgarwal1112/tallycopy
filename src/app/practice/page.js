"use client";
import { PracticeTable } from "@/components/Table";
import useAuthStore from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast, Flex } from "@chakra-ui/react";

const Practice = () => {
  const { isAuth } = useAuthStore((state) => ({
    isAuth: state.isAuth,
  }));

  const toast = useToast();

  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
      toast({
        position: "top",
        title: "You need to be logged in to view this page",
        status: "error",
        duration: 3000,
        variant: "subtle",
        isClosable: true,
      });
    }
  }, [isAuth]);

  return (
    <Flex
        w="100%"
        h="100%"
        bgColor="#090909"
    >
      <PracticeTable />
    </Flex>
  );
};

export default Practice;
