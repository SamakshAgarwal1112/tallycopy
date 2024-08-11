"use client";

import { Flex, Box, Text, Stack, Button, useToast } from "@chakra-ui/react";
import CodeEditor from "../../components/CodeEditor";
import Editor, { monaco } from "@monaco-editor/react";
import { useState } from "react";
import useQuestionStore from "@/store/QuestionStore";
import { nanoid } from "nanoid";
import useAuthStore from "@/store/AuthStore";

function PlayGround() {
  const [Code, SetCode] = useState("");
  const [outCode, setOutCode] = useState("");
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  const toast = useToast();

  const { setPlayCode, setPlayOutput, code, playCode, playOutput } =
    useQuestionStore((state) => ({
      setPlayCode: state.setPlayCode,
      setPlayOutput: state.setPlayOutput,
      code: state.code,
      playCode: state.playCode,
      playOutput: state.playOutput,
    }));

  const { userId } = useAuthStore((state) => ({
    userId: state.userId,
  }));

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      Object.keys(result).forEach((key) => {
        const res = result[key];
        if (res.status === "pass") {
          toast({
            title: `Test case ${key} passed`,
            status: "success",
            position: "top",
            duration: 3000,
            variant: "solid",
            isClosable: true,
          });
        } else if (res.status === "fail") {
          toast({
            title: `Test case ${key} failed`,
            description: `Expected: ${res.expected}, Got: ${res.output}`,
            status: "error",
            position: "top",
            duration: 3000,
            variant: "solid",
            isClosable: true,
          });
        } else if (res.status === "error") {
          toast({
            title: `Error running test case ${key}`,
            description: res.message || "Unknown error",
            status: "error",
            position: "top",
            duration: 3000,
            variant: "solid",
            isClosable: true,
          });
        }
      });
  
      console.log(result);
    } catch (error) {
      toast({
        title: "Error submitting code",
        status: "error",
        duration: 3000,
        variant: "subtle",
        isClosable: true,
      });
    } finally {
      if (actionType === "submit") {
        setIsSubmittingCode(false);
      } else if (actionType === "run") {
        setIsRunningCode(false);
      }
    }
  }

  const handleChange = (value) => {
    try {
      const parsedInput = value
        .split("\n")
        .filter(Boolean)
        .map((line) => ({
          N: parseInt(line.trim(), 10),
        }));

      setPlayCode(parsedInput);
      SetCode(value);
      console.log(parsedInput);
    } catch (error) {
      console.error("Error parsing input:", error);
    }
  };

  const handleOutChange = (value) => {
    try {
      const parsedOutput = value
        .split("\n")
        .filter(Boolean)
        .map((line) => line.trim());

      setPlayOutput(parsedOutput);
      setOutCode(value);
      console.log(parsedOutput);
    } catch (error) {
      console.error("Error parsing output:", error);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting code", code, playCode, playOutput);
    submitCodeForCompilation(
      code,
      playCode,
      playOutput,
      null,
      userId,
      "submit"
    );
  };

  return (
    <>
      <Flex direction="column" height={"100vh"} backgroundColor="#090909">
        <Button
          bg="#0d1418"
          mr="auto"
          ml="auto"
          mt="1rem"
          mb="1rem"
          width="10rem"
          onClick={handleSubmit}
          isLoading={isSubmittingCode}
          loadingText="Submitting"
        >
          Submit
        </Button>
        <Flex
          ml="auto"
          mr={0}
          overflow="hidden"
          gap={"20px"}
          px={"20px"}
          backgroundColor="#090909"
        >
          <CodeEditor />
          <Flex
            direction="column"
            h="100%"
            w={"50vw"}
            borderRadius="xl"
            overflow="hidden"
            justify="space-between"
            py={4}
          >
            <Stack h="50%">
              <Text fontSize="2xl" as="b" px="2rem">
                Input
              </Text>
              <Box
                h="90%"
                w="100%"
                bg="#0D1418"
                borderRadius="xl"
                overflow="hidden"
                p={4}
              >
                <Editor
                  padding="2rem"
                  height="100%"
                  theme="customTheme"
                  className="rounded-xl"
                  value={Code}
                  onChange={handleChange}
                />
              </Box>
            </Stack>
            <Stack h="50%">
              <Text fontSize="2xl" as="b" px="2rem">
                Output
              </Text>
              <Box
                h="90%"
                w="100%"
                bg="#0D1418"
                borderRadius="xl"
                overflow="hidden"
                p={4}
              >
                <Editor
                  height="100%"
                  theme="customTheme"
                  className="rounded-xl"
                  value={outCode}
                  onChange={handleOutChange}
                />
              </Box>
            </Stack>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default PlayGround;
