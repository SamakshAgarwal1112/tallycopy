"use client";
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Badge,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Container,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/AuthStore";
import getSubmissions from "@/app/api/getSubmissions";
import getQuestions from "@/app/api/getQuestions";
import { QuestionStatusFilter } from "@/utils/QuestionStatusFilter";
import SubmissionsTable from "./SubmissionsTable";

function Profile() {
  const { userId, userName } = useAuthStore((state) => ({
    userId: state.userId,
    userName: state.userName,
  }));

  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const data = await getSubmissions(userId);
      const filteredData = QuestionStatusFilter(data);
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
    const questionStatusMap = questions.map((question) => {
      const relevantSubmissions = submissions.filter(
        (submission) => submission.question_id === question.id
      );
      return {
        ...question,
        status: relevantSubmissions.status,
      };
    });

    setFilteredQuestions(questionStatusMap);
  }, [questions, submissions]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  const TotalSubmissions = submissions.length;

  const AcceptedQuestions = filteredQuestions.filter(
    (submission) => submission.status === "Accepted"
  ).length;

  return (
    <Box bg="#090909" minHeight="100vh" py={10}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <HStack spacing={8} alignItems="flex-start">
            <Avatar name={userName} size="2xl" />
            <VStack align="start" spacing={4} flex={1}>
              <Text fontSize="3xl" fontWeight="bold" color="white">
                {userName}
              </Text>
              <StatGroup
                width="100%"
                borderRadius="lg"
                bg="#111111"
                p={4}
                boxShadow="xl"
              >
                <HStack spacing={8} width="100%" justifyContent="space-between">
                  {["Easy", "Medium", "Hard"].map((difficulty) => (
                    <Stat key={difficulty}>
                      <StatLabel>
                        <Badge
                          colorScheme={
                            difficulty === "Easy"
                              ? "green"
                              : difficulty === "Medium"
                              ? "yellow"
                              : "red"
                          }
                          fontSize="sm"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {difficulty}
                        </Badge>
                      </StatLabel>
                      <StatNumber
                        fontSize="2xl"
                        fontWeight="bold"
                        color="white"
                      >
                        {
                          filteredQuestions.filter(
                            (q) => q.difficulty === difficulty
                          ).length
                        }
                      </StatNumber>
                    </Stat>
                  ))}
                </HStack>
              </StatGroup>
            </VStack>
          </HStack>

          <StatGroup
            borderRadius="lg"
            bg="#111111"
            p={6}
            boxShadow="xl"
            display="flex"
            justifyContent="space-between"
          >
            {[
              { label: "Solved Questions", value: AcceptedQuestions },
              { label: "Total Submissions", value: TotalSubmissions },
              {
                label: "Accuracy",
                value:
                  (TotalSubmissions === 0
                    ? 0
                    : ((AcceptedQuestions / TotalSubmissions) * 100).toFixed(
                        2
                      )) + "%",
              },
            ].map(({ label, value }) => (
              <Stat key={label} textAlign="center">
                <StatLabel fontSize="lg" color="gray.400">
                  {label}
                </StatLabel>
                <StatNumber fontSize="3xl" fontWeight="bold" color="white">
                  {value}
                </StatNumber>
              </Stat>
            ))}
          </StatGroup>
          <SubmissionsTable submissions={submissions} />
        </VStack>
      </Container>
    </Box>
  );
}

export default Profile;
