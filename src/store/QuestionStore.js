import { create } from "zustand";

const useQuestionStore = create((set) => ({
  code: "",
  playCode: "",
  testCases: [],
  playOutput: "",

 setPlayOutput: (value) => {
    set((state) => {
      return {
        ...state,
        playOutput: value,
      };
    });
  },

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
  
  setPlayCode: (value) => {
    set((state) => {
      return {
        ...state,
        playCode: value,
      };
    });
  },
}));

export default useQuestionStore;
