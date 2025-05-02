// store/authStore.ts
import { create } from "zustand";

interface AuthStore {
  token: string | null;
  setToken: (newToken: string | null) => void;
  removeToken: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
  removeToken: () => set({ token: null }),
}));

export default useAuthStore;
