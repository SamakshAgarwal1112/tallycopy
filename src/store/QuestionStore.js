import { create } from "zustand";

const useQuestionStore = create((set) => ({
  code: "",
  testCases: [],
  setTestCases: (value) => {
    set((state) => {
      return {
        ...state,
        testCases: value,
      };
    });
  },
  setCode: (value) => {
    set((state) => {
      return {
        ...state,
        code: value,
      };
    });
  },
}));

export default useQuestionStore;
