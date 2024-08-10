"use client";

import { Flex, Box, Text, Stack } from "@chakra-ui/react";
import CodeEditor from "../../components/CodeEditor";
import Editor, { monaco } from "@monaco-editor/react";

function PlayGround() {
  return (
    <Flex
      ml="auto"
      mr={0}
      overflow="hidden"
      gap={"20px"}
      px={"20px"}
      height={'100vh'}
      backgroundColor="#090909"
    >
      <CodeEditor />
      <Flex 
        direction="column"
        h="100%"
        w={'50vw'}
        borderRadius="xl"
        overflow="hidden"
        justify="space-between"
        py={4}
      >
        <Stack
          h="50%"
        >
          <Text
            fontSize="2xl"
            as="b"
            px="2rem"
          >
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
            />
          </Box>
        </Stack>
        <Stack
          h="50%"
        >
          <Text
            fontSize="2xl"
            as="b"
            px="2rem"
          >
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
            />
          </Box>
        </Stack>
      </Flex>
    </Flex>
  );
}

export default PlayGround;
