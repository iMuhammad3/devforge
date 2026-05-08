import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),

  setProfile: (profile) =>
    set((state) => ({
      profile:
        typeof profile === "function" ? profile(state.profile) : profile,
    })),

  setLoading: (loading) => set({ loading }),

  clearAuth: () =>
    set({
      user: null,
      profile: null,
      loading: false,
    }),
}));