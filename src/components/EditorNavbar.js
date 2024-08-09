"use client";
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
    <>
      <div className="sticky z-10 w-20 text-white mb-4 bg-[#0d1418]">
        <div>
          <label for="Language" class="block text-sm font-medium text-white">
            Language
          </label>

          <select
            name="Language"
            id="Language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            class="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="javascript">Javascript</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default EditorNavbar;
