"use client";

import { Box, Flex, Text, Badge } from "@chakra-ui/react";

const QuestionDescription = ({question, testcases, status}) => {

    const colorSchemes = {
        "Solved": "@00ff9a",
        "Attempted": "#fcb30b",
        "Not Attempted": "#777777",
    }

    return(
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
              colorScheme={"green"}
              variant={"subtle"}
              fontSize={"xs"}
              borderRadius={"20px"}
              paddingRight={"8px"}
              paddingLeft={"10px"}
              paddingBottom={"2px"}
              paddingTop={"4px"}
            >
              {question?.difficulty || "Easy"}
            </Badge>
          </Text>
          <Flex align={"center"}>
            <Text fontSize={"3xl"} as={"b"}>
              {question?.id}. {question?.name}
            </Text>
            <Text fontSize={"xl"} marginLeft={"auto"} color={colorSchemes[status]}>
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
    )
}

export default QuestionDescription;