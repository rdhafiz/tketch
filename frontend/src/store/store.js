import { create } from 'zustand'
import AuthService from "../services/AuthService.js";

const useStore = create((set) => ({
    user: AuthService.getUser(),
    setUser: (data) => set({ user: data }),

    project: [],
    setProject: (data) => set({ project: data }),
}));

export default useStore;