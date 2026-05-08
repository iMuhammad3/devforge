import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import LearningLayout from "@/layouts/LearningLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/features/auth/pages/Login";
import { CoursesPage, CourseDetailsPage } from "@/features/courses";

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            { path: "/", element: <h1>Home</h1> },
            { path: "/login", element: <h1>Login</h1> },
        ],
    },

    {
        element: <LearningLayout />,
        children: [
            { path: "/courses", element: <CoursesPage /> },
            { path: "/courses/:slug", element: <CourseDetailsPage /> },
            { path: "/lesson/:id", element: <h1>Lesson</h1> },
        ],
    },

    {
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [{ path: "/dashboard", element: <h1>Dashboard</h1> }],
    },
    { path: "/login", element: <Login /> },
]);
