"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Flex,
  Badge,
  Text,
  Box,
  Stack,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import CodeEditor from "@/components/CodeEditor";
import TestCaseTabs from "@/components/TestCaseTabs";
import CodeNavbar from "@/components/CodeNavbar";
import useAuthStore from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import getQuestions from "@/app/api/getQuestions";
import getTestCasesOfQuestion from "@/app/api/getTestCasesOfQuestion";
import useQuestionStore from "@/store/QuestionStore";

export default function QuestionPage() {
  const { question_id } = useParams();

  const [question, setQuestion] = useState(null); // Initialize as null
  const [testcases, setTestcases] = useState(null); // Initialize as null
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const toast = useToast();

  const isAuth = useAuthStore((state) => state.isAuth);
  const code = useQuestionStore((state) => state.code);
  const router = useRouter();

  const colorSchemes = {
    "Easy": "green",
    "Medium": "yellow",
    "Hard": "red",
  };

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
  }, [isAuth, router, toast]);

  useEffect(() => {
    if (question_id) {
      const fetchQuestionAndTestcases = async () => {
        try {
          const fetchedQuestion = await getQuestions(question_id);
          console.log("Fetched question:", fetchedQuestion);

          const fetchedTestCases = await getTestCasesOfQuestion(question_id);
          console.log("Fetched test cases:", fetchedTestCases);

          setQuestion(fetchedQuestion || {}); // Set to empty object if null
          setTestcases(fetchedTestCases || []); // Set to empty array if null
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false); // Stop loading once data is fetched
        }
      };

      fetchQuestionAndTestcases();
    }
  }, [question_id]);

  if (isLoading) {
    return (
      <Flex
        w="100vw"
        h="100vh"
        justify={"center"}
        align={"center"}
        backgroundColor="black"
      >
        <Text fontSize={"2xl"} as={"b"} pr={"1rem"}>
          Loading
        </Text>
        <Spinner
          size="lg"
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
        />
      </Flex>
    );
  }

  return (
    <Stack h={'100vh'} gap={0} overflowY={'hidden'}>
      <CodeNavbar question_id={question_id} testcases={testcases} />
      <Flex h={'100%'}>
        <Flex
          direction={"column"}
          height={"100%"}
          paddingInline={"4rem"}
          paddingBlock={"2rem"}
          border={"1px solid black"}
          borderRadius={"5px"}
          color={"white"}
          bgColor={"#111111"}
          width={"50vw"}
          overflowY={'scroll'}
        >
          <Text mb={"1rem"}>
            <Badge
              colorScheme={colorSchemes[question?.difficulty] }
              variant={"subtle"}
              fontSize={"xs"}
              borderRadius={"20px"}
              paddingRight={"8px"}
              paddingLeft={"10px"}
              paddingBottom={"2px"}
              paddingTop={"4px"}
            >
              {question?.difficulty}
            </Badge>
          </Text>
          <Flex align={"center"}>
            <Text fontSize={"3xl"} as={"b"}>
              {question?.id}. {question?.name}
            </Text>
            <Text fontSize={"xl"} marginLeft={"auto"} color={"#777777"}>
              {question?.status || "Not Attempted"}
            </Text>
          </Flex>
          <Box paddingBlock={"1rem"} color={"#777777"}>
            <Text fontSize={"base"}>{question?.description}</Text>
          </Box>
          <Box paddingBottom={"2.5rem"}>
            <Text fontSize={"lg"} as={"b"}>
              Rating: {question?.rating || 1000}
            </Text>
          </Box>
          {testcases?.map(
            (testcase, index) =>
              index < 3 && (
                <Box
                  key={index}
                  paddingY={"1.25rem"}
                  paddingX={"1.5rem"}
                  bgColor={"#1A1A1A"}
                  borderRadius={"20px"}
                  marginBottom={"1rem"}
                  color={"#777777"}
                >
                  <Text fontSize={"lg"} fontWeight={800} paddingBottom={"8px"} color={'white'}>
                    Example {index + 1}:
                  </Text>
                  <Text paddingLeft={"1rem"} borderLeft={"1px solid #777777"}>
                    Input:-{" "}
                    {Object.entries(testcase.input).map(([key, value]) => (
                      <Text key={key}>
                        {key}: {value}
                      </Text>
                    ))}
                  </Text>
                  <Text paddingLeft={"1rem"} borderLeft={"1px solid #777777"}>
                    Output: {testcase.expected_output}
                  </Text>
                </Box>
              )
          )}
        </Flex>
        <Stack
          height={"100%"}
          justify={"center"}
          align={"center"}
          border={"1px solid black"}
          borderRadius={"5px"}
          color={"white"}
          bgColor={"#090909"}
          width={"50vw"}
        >
          <Flex h={"50%"} w={"100%"}>
            <CodeEditor />
          </Flex>
          <Flex h={"50%"} w={"100%"}>
            <TestCaseTabs testcases={testcases} />
          </Flex>
        </Stack>
      </Flex>
    </Stack>
  );
}