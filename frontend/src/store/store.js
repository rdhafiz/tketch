import { create } from 'zustand'
import AuthService from "../services/AuthService.js";

const useStore = create((set) => ({
    user: AuthService.getUser(),
    setUser: (data) => set({ user: data }),
}));

export default useStore;