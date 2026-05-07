import { useEffect } from "react";
import { initAuthListener } from "@/services/firebase/auth";

export default function AuthProvider({ children }) {
  useEffect(() => {
    const unsubscribe = initAuthListener();

    return () => {
      unsubscribe();
    };
  }, []);

  return children;
}