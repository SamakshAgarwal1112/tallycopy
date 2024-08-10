import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStatusStore = create(
  persist(
    (set) => ({
        status: null,
        setStatus: (status) => set({ status }),
    }),
    {
      name: "status-storage",
      getStorage: () => localStorage,
    }
));

export default useStatusStore;
