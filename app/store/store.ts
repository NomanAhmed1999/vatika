// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// interface AuthState {
//   accessToken: string | null
//   setAccessToken: (token: string | null) => void
//   clearAccessToken: () => void
// }

// const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       accessToken: null,
//       setAccessToken: (token) => set({ accessToken: token }),
//       clearAccessToken: () => set({ accessToken: null }),
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// )

// export default useAuthStore 


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
                       
type StoreState = {
  bears: number;
  users: {
    access_token?: string;
    user?: {
      id: number;
      email: string;
      full_name: string;
      is_superuser: boolean;
      created_at: string;
    };
  } | null;
  email: Record<string, any> | null;
  increasePopulation: () => void;
  updateUser: (newUser: any) => void;
  otpEmail: (newEmail: Record<string, any>) => void;
};

export const Store = create<StoreState>()(
  persist(
    (set) => ({
      bears: 0,
      users: null,
      email: null,
      increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
      updateUser: (newUser: any) => {
        console.log("Updating user in store:", newUser);
        set({ users: newUser });
      },
      otpEmail: (newEmail: any) => set({ email: newEmail }),
    }),
    {
      name: 'bears-store',
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const storedValue = sessionStorage.getItem(name);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(name);
          }
        },
      },
      partialize: (state: any) => ({
        users: state.users,
        email: state.email,
      }),
    }
  )
);
