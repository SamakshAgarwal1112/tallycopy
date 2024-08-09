"use client";
import { Box } from "@chakra-ui/react";
import Editor, { monaco } from "@monaco-editor/react";
import { useCallback } from "react";
import EditorNavbar from "./EditorNavbar";
import useEditorStore from "@/store/EditorStore";

export default function CodeEditor() {
  const { language } = useEditorStore((state) => ({
    language: state.language,
  }));

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
      />
    </Box>
  );
}
