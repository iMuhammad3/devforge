import { loginWithGoogle } from "@/services/firebase/auth";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={loginWithGoogle}
        className="px-4 py-2 rounded-md bg-primary text-white"
      >
        Sign in with Google
      </button>
    </div>
  );
}