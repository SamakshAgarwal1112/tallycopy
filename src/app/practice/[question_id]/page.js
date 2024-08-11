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
    Badge,
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
    const [activeTab, setActiveTab] = useState(0);
    const [isCompiling, setIsCompiling] = useState(false); 
    const [results, setResults] = useState([]);

    const toast = useToast();

    const {isAuth, userId} = useAuthStore((state) => ({
      isAuth: state.isAuth,
      userId: state.userId,
    }));
    const code = useQuestionStore((state) => state.code);

    const statusTheme = {
      "pass": "green",
      "fail": "red",
    }

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

    const handleCompilationResults = (result) => {
      setResults(Object.values(result) || []); 
      setIsCompiling(false);
      
    };

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
        <CodeNavbar 
          question_id={question_id} 
          testcases={testcases} 
          setActiveTab={setActiveTab}
          setSubmissions={setSubmissions}
          setIsCompiling={setIsCompiling}
          onCompilationComplete={handleCompilationResults}
        />
        <Flex h={'100%'}>
          <Tabs index={activeTab} onChange={setActiveTab} w={'50vw'} h={'100%'} colorScheme="grey" bgColor={"#090909"}>
            <TabList>
              <Tab>Description</Tab>
              <Tab>Past Submissions</Tab>
              <Tab>Results</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0} overflowY={'scroll'}>
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
                          </Tr>
                        </Thead>
                        <Tbody>
                          {submissions.map((submission) => (
                            <Tr key={submission.id}>
                              <Td>{submission.status}</Td>
                              <Td>{formatDate(submission.created_at)}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  )
                }
              </TabPanel>
              <TabPanel> 
                {
                  isCompiling ? (
                    <Flex justify="center" align="center" height="100%">
                      <Spinner size="xl" color="blue.500" />
                      <Text ml="4">Compiling...</Text>
                    </Flex>
                  ) : results.length === 0 ? (
                    <Flex justify="center" align="center" height="100%">
                      <Text>No results available</Text>
                    </Flex>
                  ) : (
                    <TableContainer>
                      <Table variant="simple" colorScheme="grey">
                        <Thead>
                          <Tr>
                            <Th>Test Case</Th>
                            <Th>Expected Output</Th>
                            <Th>Your Output</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {Array.from(results).map((result, index) => (
                            <Tr key={index}>
                              <Td>{index+1}</Td>
                              <Td>{result.expected || "-"}</Td>
                              <Td>{result.actual || "-"}</Td>
                              <Td>
                                <Badge       
                                    color={statusTheme[result.status]}       
                                    variant={"subtle"}
                                    fontSize={"xs"}
                                    borderRadius={"20px"}
                                    paddingRight={"8px"}
                                    paddingLeft={"10px"}
                                    paddingBottom={"2px"}
                                    paddingTop={"4px"}>
                                    {result.status}
                                </Badge>
                                </Td>
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