"use client";
import Editor, { monaco } from "@monaco-editor/react";
import { useCallback } from "react";
import EditorNavbar from "./EditorNavbar";
import useEditorStore from "@/store/EditorStore";

export default function CodeEditor() {
  const editorOptions = {
    fontSize: 18,
    wordWrap: "on",
    minimap: {
      enabled: false,
    },
  };

  const { language } = useEditorStore((state) => ({
    language: state.language,
  }));

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
    <>
      <div className="h-[80vh] w-[70vh] bg-[#0d1418] rounded-lg mr-0 ml-auto overflow-hidden p-4">
        <EditorNavbar />
        <Editor
          height="100%"
          language={language}
          options={editorOptions}
          theme="customTheme"
          onMount={handleEditorMount}
        />
      </div>
    </>
  );
}
