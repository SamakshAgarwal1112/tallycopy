"use client";
import { Box } from "@chakra-ui/react";
import Editor, { monaco } from "@monaco-editor/react";
import { useCallback, useEffect } from "react";
import EditorNavbar from "./EditorNavbar";
import useEditorStore from "@/store/EditorStore";

export default function CodeEditor() {
  const { language, boilerplate, setBoilerplate } = useEditorStore((state) => ({
    language: state.language,
    boilerplate: state.boilerplate,
    setBoilerplate: state.setBoilerplate,
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


main();`
    }
  ];

  useEffect(() => {
    function boilerplateSetter() {
      let val = boilerplates.find((b) => b.lang === language);
      val = val ? val.code : "";

      setBoilerplate(val);
    }
    boilerplateSetter();
    console.log(boilerplate);
  }, [language, setBoilerplate]);

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
      height="50vh"
      width="70vh"
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
        className="rounded-xl"
        value={boilerplate}
      />
    </Box>
  );
}
