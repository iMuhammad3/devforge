import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./config";
import { useAuthStore } from "@/features/auth/store/authStore";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const logoutUser = () => {
  return signOut(auth);
};

// 👇 GLOBAL AUTH LISTENER 
export const initAuthListener = () => {
  const { setUser, setLoading } = useAuthStore.getState();

  onAuthStateChanged(auth, (user) => {
    setUser(user || null);
    setLoading(false);
  });
};