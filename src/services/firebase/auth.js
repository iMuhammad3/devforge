import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./config";
import { useAuthStore } from "@/features/auth/store/authStore";
import { createUserProfile, getUserProfile } from "@/services/firebase/firestore";

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
  const { setUser, setProfile, setLoading } = useAuthStore.getState();

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setLoading(true);

    if (!user) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    setUser(user);

    const profile = await getUserProfile(user.uid);
    setProfile(profile);

    setLoading(false);
  });

  return unsubscribe;
};