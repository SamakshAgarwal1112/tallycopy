"use client";
import { PracticeTable } from "@/components/Table";
import useAuthStore from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";

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
        title: "You need to be logged in to view this page",
        status: "error",
        duration: 3000,
        variant: "subtle",
        isClosable: true,
      });
    }
  }, [isAuth]);

  return (
    <div className="p-4">
      <PracticeTable />
    </div>
  );
};

export default Practice;
