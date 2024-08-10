"use client";
import { Box } from "@chakra-ui/react";
import Editor, { monaco } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import EditorNavbar from "./EditorNavbar";
import useEditorStore from "@/store/EditorStore";
import useQuestionStore from "@/store/QuestionStore";

export default function CodeEditor() {
  const { language, boilerplate, setBoilerplate } = useEditorStore((state) => ({
    language: state.language,
    boilerplate: state.boilerplate,
    setBoilerplate: state.setBoilerplate,
  }));

  const [currentCode, setCurrentCode] = useState(boilerplate);

  const { setCode, code } = useQuestionStore((state) => ({
    setCode: state.setCode,
    code: state.code,
  }));

  const boilerplates = [
    {
      lang: "cpp",
      code: `#include <iostream>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`,
    },
    {
      lang: "java",
      code: `public class Main {
    public static void main(String[] args) {
        // your code goes here
    }
}`,
    },
    {
      lang: "javascript",
      code: `function main() {
  // your code goes here
}

main();`,
    },
  ];

  useEffect(() => {
    function boilerplateSetter() {
      let val = boilerplates.find((b) => b.lang === language);
      val = val ? val.code : "";

      setBoilerplate(val);
      setCurrentCode(val);
    }
    boilerplateSetter();
  }, [language, setBoilerplate]);

  function handleChange(value) {
    setCurrentCode(value);
    setCode(value);
    console.log(code);
  }

  const editorOptions = {
    fontSize: 18,
    wordWrap: "on",
    minimap: {
      enabled: false,
    },
  };

  const handleEditorMount = useCallback((editor, monacoInstance) => {
    monacoInstance.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [{ token: "", background: "0D1418" }],
      colors: {
        "editor.background": "#0D1418",
      },
    });

    monacoInstance.editor.setTheme("customTheme");
  }, []);

  return (
    <Box
      h="100%"
      w={'50vw'}
      bg="#0D1418"
      borderRadius="xl"
      overflow="hidden"
      p={4}
    >
      <EditorNavbar />
      <Editor
        height="100%"
        language={language}
        options={editorOptions}
        theme="customTheme"
        onMount={handleEditorMount}
        value={currentCode}
        onChange={handleChange}
      />
    </Box>
  );
}
