"use client";
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

const SubmissionsTable = ({ submissions }) => {
  const { userId } = useAuthStore((state) => ({
    userId: state.userId,
  }));

  const colorSchemes = {
    Solved: "@00ff9a",
    Attempted: "#fcb30b",
    "Not Attempted": "#777777",
  };

  const difficultyColorSchemes = {
    Easy: "green",
    Medium: "yellow",
    Hard: "red",
  };

  return (
    <Box overflowX={"auto"} w="100%" h="100%">
      <Stack spacing={4} paddingInline={"10rem"} paddingBlock={"2rem"}>
        <Text fontSize={"2xl"} as={"b"}>
          Submitted Problems
        </Text>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th letterSpacing={"4px"}>Status</Th>
                <Th letterSpacing={"4px"}>Title</Th>
                <Th letterSpacing={"4px"}>Difficulty</Th>
              </Tr>
            </Thead>
            <Tbody>
              {submissions.map((question) => (
                <Tr
                  key={question.id}
                  cursor={"pointer"}
                  onClick={() => {
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
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default SubmissionsTable;
