"use client";

import { useEffect, useState } from "react";
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
import { useParams, useRouter } from "next/navigation";
import getQuestions from "@/app/api/getQuestions";
import getTestCasesOfQuestion from "@/app/api/getTestCasesOfQuestion";
import useQuestionStore from "@/store/QuestionStore";
import useStatusStore from "@/store/StatusStore";
import QuestionDescription from "@/components/QuestionDescription";

export default function QuestionPage() {
  const router = useRouter();
  const { question_id } = useParams();
  const { status } = useStatusStore((state) => ({
    status: state.status,
  }));

  const [question, setQuestion] = useState(null);
  const [testcases, setTestcases] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const isAuth = useAuthStore((state) => state.isAuth);
  const code = useQuestionStore((state) => state.code);

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

          setQuestion(fetchedQuestion || {});
          setTestcases(fetchedTestCases || []);
          setQuestion((prev) => ({
            ...prev,
            status: status,
          }));
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
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
        <QuestionDescription question={question} testcases={testcases} status={status}/>
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
