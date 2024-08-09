"use client";

import { Select, Option } from "@material-tailwind/react";
import useEditorStore from "@/store/EditorStore";

function EditorNavbar() {
  const { language, setLanguage } = useEditorStore((state) => ({
    language: state.language,
    setLanguage: state.setLanguage,
  }));

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  return (
    <div className="sticky z-10 w-4 text-white mb-4 bg-[#0d1418]">
      <Select
        variant="static"
        color="teal"
        value={language}
        onChange={handleLanguageChange}
        className="text-white no-underline"
      >
        <Option value="cpp">cpp</Option>
        <Option value="java">java</Option>
        <Option value="javascript">javascript</Option>
      </Select>
    </div>
  );
}

export default EditorNavbar;
