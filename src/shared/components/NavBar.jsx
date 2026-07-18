import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/authStore";
import { logoutUser } from "@/services/firebase/auth";
import ThemeToggle from "@/shared/components/ThemeToggle";

export default function Navbar() {
    const user = useAuthStore(state => state.user);
    const profile = useAuthStore(state => state.profile);
    const isAdmin = profile?.role === "admin";
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleLogout = async () => {
        await logoutUser();
        closeMenu();
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="text-sm font-bold tracking-tight"
                >
                    DevForge
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-6 text-sm md:flex">
                    <NavItem to="/courses">Courses</NavItem>

                    {user && (
                        <>
                            <NavItem to="/dashboard">Dashboard</NavItem>
                            <NavItem to="/bookmarks">Bookmarks</NavItem>
                        </>
                    )}
                    {isAdmin && <NavItem to="/admin">Admin</NavItem>}
                </div>

                {/* Desktop auth area */}
                <div className="hidden items-center gap-3 md:flex">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link to='/profile'>
                                <UserAvatar user={user} />
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile controls */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => setIsOpen(current => !current)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="border-t border-border bg-background px-6 py-4 md:hidden">
                    <div className="flex flex-col gap-2">
                        <MobileNavItem to="/courses" onClick={closeMenu}>
                            Courses
                        </MobileNavItem>

                        {user ? (
                            <>
                                <MobileNavItem
                                    to="/dashboard"
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </MobileNavItem>

                                <MobileNavItem
                                    to="/bookmarks"
                                    onClick={closeMenu}
                                >
                                    Bookmarks
                                </MobileNavItem>

                                <MobileNavItem
                                    to="/profile"
                                    onClick={closeMenu}
                                >
                                    Profile
                                </MobileNavItem>
                                {isAdmin && (
                                    <MobileNavItem
                                        to="/admin"
                                        onClick={closeMenu}
                                    >
                                        Admin
                                    </MobileNavItem>
                                )}

                                <MobileNavItem
                                    to="/settings"
                                    onClick={closeMenu}
                                >
                                    Settings
                                </MobileNavItem>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-2 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="mt-2 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavItem({ to, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground transition hover:text-foreground"
            }
        >
            {children}
        </NavLink>
    );
}

function MobileNavItem({ to, children, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
            }
        >
            {children}
        </NavLink>
    );
}

function UserAvatar({ user }) {
    if (user?.photoURL) {
        return (
            <img
                src={user.photoURL}
                alt={user.displayName || "User avatar"}
                className="h-8 w-8 rounded-full"
            />
        );
    }

    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {user?.displayName?.charAt(0) || "U"}
        </div>
    );
}
