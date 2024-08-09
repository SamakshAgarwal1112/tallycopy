"use client";
import { Box, FormControl, FormLabel, Select } from "@chakra-ui/react";
import useEditorStore from "@/store/EditorStore";

function EditorNavbar() {
  const { language, setLanguage } = useEditorStore((state) => ({
    language: state.language,
    setLanguage: state.setLanguage,
  }));

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex="1"
      width="10rem"
      backgroundColor="#0D1418"
      color="white"
      padding={4}
    >
      <FormControl>
        <FormLabel htmlFor="language">Language</FormLabel>
        <Select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          borderColor="gray.300"
          backgroundColor="gray.700"
          color="white"
          _placeholder={{ color: "gray.500" }}
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">Javascript</option>
        </Select>
      </FormControl>
    </Box>
  );
}

export default EditorNavbar;
