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
    <>
      <CodeNavbar question_id={question_id} testcases={testcases} />
      <Flex>
        <Flex
          direction={"column"}
          height={"100vh"}
          paddingInline={"4rem"}
          paddingBlock={"2rem"}
          border={"1px solid black"}
          borderRadius={"5px"}
          color={"white"}
          bgColor={"#222222"}
          width={"50vw"}
        >
          <Flex align={"center"}>
            <Text fontSize={"3xl"} as={"b"}>
              {question?.id}. {question?.name}
            </Text>
            <Text fontSize={"xl"} marginLeft={"auto"}>
              {question?.status || "Not Attempted"}
            </Text>
          </Flex>
          <Text>
            <Badge
              colorScheme={"green"}
              variant={"subtle"}
              fontSize={"xs"}
              borderRadius={"10px"}
              paddingInline={"5px"}
            >
              {question?.difficulty || "Easy"}
            </Badge>
          </Text>
          <Box paddingTop={"1rem"} paddingBottom={"2rem"}>
            <Text fontSize={"base"}>{question?.description}</Text>
          </Box>
          <Box paddingBottom={"4rem"}>
            <Text fontSize={"lg"} as={"b"}>
              Rating: {question?.rating || 1000}
            </Text>
          </Box>
          {testcases?.map(
            (testcase, index) =>
              index < 3 && (
                <Box
                  key={index}
                  padding={"1rem"}
                  bgColor={"#323232"}
                  borderRadius={"5px"}
                  marginBottom={"1rem"}
                >
                  <Text fontSize={"lg"} fontWeight={800} paddingBottom={"8px"}>
                    Example {index + 1}:
                  </Text>
                  <Text paddingLeft={"1rem"} borderLeft={"1px solid white"}>
                    Input:-{" "}
                    {Object.entries(testcase.input).map(([key, value]) => (
                      <Text key={key}>
                        {key}: {value}
                      </Text>
                    ))}
                  </Text>
                  <Text paddingLeft={"1rem"} borderLeft={"1px solid white"}>
                    Output: {testcase.expected_output}
                  </Text>
                </Box>
              )
          )}
        </Flex>
        <Stack
          spacing={4}
          height={"100vh"}
          justify={"center"}
          align={"center"}
          paddingInline={"4rem"}
          paddingBlock={"2rem"}
          border={"1px solid black"}
          borderRadius={"5px"}
          color={"white"}
          bgColor={"#222222"}
          width={"50vw"}
        >
          <CodeEditor />
          <TestCaseTabs testcases={testcases} />
        </Stack>
      </Flex>
    </>
  );
}
