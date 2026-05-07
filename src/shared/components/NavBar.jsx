import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { logoutUser } from "@/services/firebase/auth";

export default function Navbar() {
    const user = useAuthStore(state => state.user);

    return (
        <nav className="h-16 border-b border-border flex items-center justify-between px-6">
            {/* LEFT */}
            <Link to="/" className="font-bold">
                DevForge
            </Link>

            {/* CENTER */}
            <div className="flex gap-4 text-sm">
                <Link to="/courses">Courses</Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || "User avatar"}
                                className="h-8 w-8 rounded-full"
                            />
                        ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                {user.displayName?.charAt(0) || "U"}
                            </div>
                        )}

                        <button
                            onClick={logoutUser}
                            className="text-sm opacity-70 hover:opacity-100"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="text-sm">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
