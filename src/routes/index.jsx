import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import LearningLayout from "@/layouts/LearningLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/features/auth/pages/Login";
import { CoursesPage, CourseDetailsPage } from "@/features/courses";
import { LessonPage } from "@/features/lessons";
import { HomePage } from "@/features/home";
import { DashboardPage } from "@/features/dashboard";
import { SettingsPage } from "@/features/settings";

export const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <Login /> },
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
        children: [
            { path: "/dashboard", element: <DashboardPage /> },
            { path: "/settings", element: <SettingsPage /> },
        ],
    },
    { path: "/login", element: <Login /> },
    {
        element: <LearningLayout />,
        children: [
            { path: "/courses", element: <CoursesPage /> },
            { path: "/courses/:slug", element: <CourseDetailsPage /> },
            {
                path: "/courses/:courseSlug/lessons/:lessonSlug",
                element: <LessonPage />,
            },
        ],
    },
]);
