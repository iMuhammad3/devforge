import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./config";
import { useAuthStore } from "@/features/auth/store/authStore";
import { createUserProfile } from "@/services/firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  await createUserProfile(user);

  return user;
};

export const logoutUser = () => {
  return signOut(auth);
};

export const initAuthListener = () => {
  const { setUser, setLoading } = useAuthStore.getState();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user || null);
    setLoading(false);
  });

  return unsubscribe;
};