"use client";

import {
  Avatar,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { TbCloudUpload } from "react-icons/tb";
import Link from "next/link";
import useQuestionStore from "@/store/QuestionStore";
import useAuthStore from "@/store/AuthStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

function CodeNavbar({ question_id, testcases }) {
  const { testCases, code } = useQuestionStore((state) => ({
    testCases: state.testCases,
    code: state.code,
  }));

  const { removeAuth, userId } = useAuthStore((state) => ({
    removeAuth: state.removeAuth,
    userId: state.userId,
  }));

  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isRunningCode, setIsRunningCode] = useState(false);

  const router = useRouter();
  const toast = useToast(); // Move useToast here

  const handleLogout = () => {
    removeAuth();
    router.push("/login");
  };

  async function submitCodeForCompilation(
    code,
    testCase,
    expectedOutputs,
    question_id,
    userId,
    actionType
  ) {
    if (actionType === "submit") {
      setIsSubmittingCode(true);
    } else if (actionType === "run") {
      setIsRunningCode(true);
    }

    try {
      const response = await fetch("/api/getCompileResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          testCase,
          expectedOutputs,
          question_id,
          userId,
        }),
      });
      const result = await response.json();
      
      if (!response.ok) {
        toast({
          position: "bottom",
          status: "error",
          title: "Submission Failed",
          description:result.message,
          variant: "subtle",
          isClosable: true,
          duration: 3000,
        });
      }

      console.log(result)

    } finally {
      if (actionType === "submit") {
        setIsSubmittingCode(false);
      } else if (actionType === "run") {
        setIsRunningCode(false);
      }
    }
  }

  const handleSubmit = () => {
    const testCase = testcases.map((testcase) => testcase.input);

    const expectedOutputs = testcases.map(
      (testcase) => testcase.expected_output
    );

    submitCodeForCompilation(
      code,
      testCase,
      expectedOutputs,
      question_id,
      userId,
      "submit"
    );
  };

  const handleRun = () => {
    const testCase = testCases.map((testcase) => ({
      N: parseInt(testcase.input),
    }));

    const expectedOutputs = testCases.map(
      (testcase) => testcase.expected_output
    );

    submitCodeForCompilation(
      code,
      testCase,
      expectedOutputs,
      question_id,
      userId,
      "run"
    );
  };



  return (
    <Flex
      position="sticky"
      top={0}
      zIndex="10"
      width="100%"
      backgroundColor="#090909"
      color="white"
      p={4}
      align="center"
      justify="space-evenly"
    >
      <Flex>
        <Link href="/practice">
          <Text>Problem list</Text>
        </Link>
      </Flex>

      <Flex gap="1rem">
        <Button
          leftIcon={<FaPlay />}
          onClick={handleRun}
          isLoading={isRunningCode}
          loadingText="Running"
        >
          Run
        </Button>
        <Button
          leftIcon={<TbCloudUpload />}
          onClick={handleSubmit}
          isLoading={isSubmittingCode}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </Flex>

      <Flex>
        <Menu>
          <MenuButton>
            <Avatar name="Dan Abrahmov" />
          </MenuButton>
          <MenuList color="white">
            <MenuItem
              onClick={() => {
                router.push(`/profile/${userId}`);
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default CodeNavbar;
