import { create } from "zustand";

const useQuestionStore = create((set) => ({
  code: "",

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
