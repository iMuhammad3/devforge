import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "@/layouts/PublicLayout";
import LearningLayout from "@/layouts/LearningLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import ProtectedRoute from "./ProtectedRoute";

import Login from "@/features/auth/pages/Login";
import { HomePage } from "@/features/home";
import { CoursesPage, CourseDetailsPage } from "@/features/courses";
import { LessonPage } from "@/features/lessons";
import { DashboardPage } from "@/features/dashboard";
import { SettingsPage } from "@/features/settings";
import { ProfilePage } from "@/features/profile";
import { BookmarksPage } from "@/features/bookmarks";
import { NotFoundPage } from "@/features/errors";
import AdminRoute from "./AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";
import {
    AdminCoursesPage,
    AdminDashboardPage,
    AdminEditCoursePage,
    AdminEditLessonPage,
    AdminLessonsPage,
    AdminNewCoursePage,
    AdminNewLessonPage,
} from "@/features/admin";

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
            {
                path: "/courses/:courseSlug/lessons/:lessonSlug",
                element: <LessonPage />,
            },
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
            { path: "/profile", element: <ProfilePage /> },
            { path: "/bookmarks", element: <BookmarksPage /> },
        ],
    },
    {
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            { path: "/admin", element: <AdminDashboardPage /> },
            { path: "/admin/courses", element: <AdminCoursesPage /> },
            { path: "/admin/lessons", element: <AdminLessonsPage /> },
            {
                path: "/admin/courses/:courseId/edit",
                element: <AdminEditCoursePage />,
            },
            { path: "/admin/courses/new", element: <AdminNewCoursePage /> },
            { path: "/admin/lessons/new", element: <AdminNewLessonPage /> },
            {
                path: "/admin/lessons/:lessonId/edit",
                element: <AdminEditLessonPage />,
            },
        ],
    },

    {
        element: <PublicLayout />,
        children: [{ path: "*", element: <NotFoundPage /> }],
    },
]);
