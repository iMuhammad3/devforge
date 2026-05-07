import { useEffect } from "react";
import { initAuthListener } from "@/services/firebase/auth";

export default function AuthProvider({ children }) {
  useEffect(() => {
    initAuthListener();
  }, []);

  return children;
}