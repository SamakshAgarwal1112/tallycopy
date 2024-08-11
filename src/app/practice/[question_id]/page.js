"use client";

import { useEffect, useState } from "react";
import {
  Flex,
  Text,
  Stack,
  Spinner,
  useToast,
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
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
import getSubmissions from "@/app/api/getSubmissions";

export default function QuestionPage() {
  const router = useRouter();
  const { question_id } = useParams();
  const { status } = useStatusStore((state) => ({
    status: state.status,
  }));

  const [question, setQuestion] = useState(null);
  const [testcases, setTestcases] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  const {isAuth, userId} = useAuthStore((state) => ({
    isAuth: state.isAuth,
    userId: state.userId,
  }));
  const code = useQuestionStore((state) => state.code);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return date.toLocaleDateString(undefined, options);
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
      const fetchQuestionRelatedData = async () => {
        try {
          const fetchedQuestion = await getQuestions(question_id);
          console.log("Fetched question:", fetchedQuestion);

          const fetchedTestCases = await getTestCasesOfQuestion(question_id);
          console.log("Fetched test cases:", fetchedTestCases);

          const fetchedSubmissions = await getSubmissions(userId, question_id);
          console.log("Fetched submissions:", fetchedSubmissions);

          setQuestion(fetchedQuestion || {});
          setTestcases(fetchedTestCases || []);
          setSubmissions(fetchedSubmissions || []);

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
      fetchQuestionRelatedData();
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
        <Tabs w={'50vw'} h={'100%'} colorScheme="grey" bgColor={"#090909"}>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Past Submissions</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
            <QuestionDescription question={question} testcases={testcases} status={status}/>
            </TabPanel>
            <TabPanel>
              {
                submissions.length === 0 ? (
                  <Flex justify="center" align="center" height="100%">
                    <Text>No submissions found</Text>
                  </Flex>
                ) : (
                  <TableContainer>
                    <Table variant="simple" colorScheme="grey">
                      <Thead>
                        <Tr>
                          <Th>Status</Th>
                          <Th>Date</Th>
                          <Th>Testcases Passed</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {submissions.map((submission) => (
                          <Tr key={submission.id}>
                            <Td>{submission.status}</Td>
                            <Td>{formatDate(submission.created_at)}</Td>
                            <Td>{submission.testcases_passed}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )
              }
            </TabPanel>
          </TabPanels>
        </Tabs>
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