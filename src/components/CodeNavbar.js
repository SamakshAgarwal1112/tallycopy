"use client";

import { Avatar, Flex, Text, Button } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import { TbCloudUpload } from "react-icons/tb";
import Link from "next/link";
import useQuestionStore from "@/store/QuestionStore";
import useAuthStore from "@/store/AuthStore";
import { useState } from "react";

function CodeNavbar({ question_id, testcases }) {
  const code = useQuestionStore((state) => state.code);
  const userId = useAuthStore((state) => state.userId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitCodeForCompilation(
    code,
    testCase,
    expectedOutputs,
    question_id,
    userId
  ) {
    setIsSubmitting(true);
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      // Handle the result here (e.g., show success/failure message)
    } catch (error) {
      console.error("Error submitting code:", error);
      // Handle the error here (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = () => {
    const testCase = testcases.map((testcase) => ({
      N: parseInt(testcase.input),
    }));

    const expectedOutputs = testcases.map(
      (testcase) => testcase.expected_output
    );

    submitCodeForCompilation(
      code,
      testCase,
      expectedOutputs,
      question_id,
      userId
    );
  };

  return (
    <Flex
      position="sticky"
      top={0}
      zIndex="10"
      width="100%"
      backgroundColor="black"
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
          onClick={() => {
            // Handle run code action
          }}
        >
          Run
        </Button>
        <Button
          leftIcon={<TbCloudUpload />}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText="Submitting"
        >
          Submit
        </Button>
      </Flex>

      <Flex>
        <Avatar marginRight="1rem" name="Dan Abrahmov" />
      </Flex>
    </Flex>
  );
}

export default CodeNavbar;
