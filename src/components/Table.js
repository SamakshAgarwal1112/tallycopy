"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Stack,
  Spinner,
  Flex,
  Box,
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import getSubmissions from "@/app/api/getSubmissions";
import { QuestionStatusFilter } from "@/utils/QuestionStatusFilter";
import getQuestions from "@/app/api/getQuestions";
import useAuthStore from "@/store/AuthStore";
import useStatusStore from "@/store/StatusStore";

export const PracticeTable = () => {
  const [questions, setQuestions] = useState([]);
  const { setStatus } = useStatusStore((state) => ({
    setStatus: state.setStatus,
  }));
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);

  const { userId } = useAuthStore((state) => ({
    userId: state.userId,
  }));

  const colorSchemes = {
    Solved: "@00ff9a",
    Attempted: "#fcb30b",
    "Not Attempted": "#777777",
  };

  const difficultyColorSchemes = {
    "Easy": "green",
    "Medium": "yellow",
    "Hard": "red",
  };


  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissions = await getSubmissions(userId);

      const filteredData = QuestionStatusFilter(submissions);
      setSubmissions(filteredData);
    };

    const fetchQuestions = async () => {
      const data = await getQuestions();
      setQuestions(data);
    };

    fetchSubmissions();
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length) {
      const questionStatusMap = questions.map((question) => {
        const relevantSubmissions = submissions.filter(
          (submission) => submission.question_id === question.id
        );
        if (!relevantSubmissions.length) {
          return {
            ...question,
            status: "Not Attempted",
          };
        } else {
          return {
            ...question,
            status: relevantSubmissions[0].status,
          };
        }
      });

      setFilteredQuestions(questionStatusMap);
    }
  }, [questions, submissions]);

  if (questions.length === 0) {
    return (
      <Flex w="100vw" h="100vh" justify={"center"} align={"center"}>
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
    <Box overflowX={"auto"} w="100%" h="100%">
      <Stack spacing={4} paddingInline={"10rem"} paddingBlock={"2rem"}>
        <Text fontSize={"2xl"} as={"b"}>
          Practice Problems
        </Text>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th letterSpacing={"4px"}>Status</Th>
                <Th letterSpacing={"4px"}>Title</Th>
                <Th letterSpacing={"4px"}>Difficulty</Th>
                <Th letterSpacing={"4px"}>Rating</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredQuestions.map((question) => (
                <Tr
                  key={question.id}
                  cursor={"pointer"}
                  onClick={() => {
                    setStatus(question.status);
                    router.push(`/practice/${question.id}`);
                  }}
                >
                  <Td color={colorSchemes[question.status]}>
                    {question.status}
                  </Td>
                  <Td>
                    {question.id}. {question.name}
                  </Td>
                  <Td>
                    {" "}
                    <Badge
                      colorScheme={difficultyColorSchemes[question?.difficulty]}
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
                  </Td>
                  <Td>1000</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};
