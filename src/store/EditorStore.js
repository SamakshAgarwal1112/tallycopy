import { create } from "zustand";

const useEditorStore = create((set) => ({
  language: "cpp",

  setLanguage: (value) => {
    set((state) => {
      return {
        ...state,
        language: value,
      };
    });
  },
}));

export default useEditorStore;
