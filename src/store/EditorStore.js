import { create } from "zustand";

const useEditorStore = create((set) => ({
  language: "cpp",
  boilerplate: `#include <iostream>
using namespace std;

int main() {
    // your code goes here";
    return 0;
}`,

  setLanguage: (value) => {
    set((state) => {
      return {
        ...state,
        language: value,
      };
    });
  },

  setBoilerplate: (value) => {
    set((state) => {
      return {
        ...state,
        boilerplate: value,
      };
    });
  },
}));

export default useEditorStore;
