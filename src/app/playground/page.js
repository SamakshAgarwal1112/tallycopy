import { Box } from "@chakra-ui/react";
import CodeEditor from "../../components/CodeEditor";
import TestCaseTabs from "@/components/TestCaseTabs";

function PlayGround() {
  return (
    <Box
      ml="auto"
      mr={0}
      overflow="hidden"
      w="70vh"
      display="flex"
      flexDirection="column"
      gap={5}
      px={2}
    >
      <CodeEditor />
      <TestCaseTabs />
    </Box>
  );
}

export default PlayGround;
