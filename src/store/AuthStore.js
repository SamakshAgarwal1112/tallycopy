import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      isAuth: false,
      userEmail: "",
      userName: "",
      userId: "",

      setUserId: (value) => {
        set((state) => ({
          ...state,
          userId: value,
        }));
      },

      setUserEmail: (value) => {
        set((state) => ({
          ...state,
          userEmail: value,
        }));
      },

      setUserName: (value) => {
        set((state) => ({
          ...state,
          userName: value,
        }));
      },

      addAuth: () => {
        set((state) => ({
          ...state,
          isAuth: true,
        }));
      },

      removeAuth: () => {
        set((state) => ({
          ...state,
          isAuth: false,
          userEmail: "",
          userName: "",
          userId: "",
        }));
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
