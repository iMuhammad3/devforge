# DevForge

DevForge is a frontend-focused learning platform built with React, Tailwind CSS, and Firebase.

It allows users to browse courses, read markdown-based lessons, bookmark lessons, track progress, and continue learning from where they stopped. It also includes a protected admin area for creating and managing courses and lessons.

## Features

### Public learning experience

- Landing page
- Course browsing
- Course search and filtering
- Course detail pages
- Markdown-based lesson pages
- Syntax-highlighted code blocks
- Copy code button
- Lesson reading time
- Lesson table of contents
- Previous/next lesson navigation
- Dark/light mode
- Responsive navigation

### Authenticated user features

- Google authentication
- Firestore user profiles
- Dashboard
- Profile settings
- Public profile page
- Lesson bookmarks
- Lesson completion
- Course progress
- Continue learning experience

### Admin features

- Protected admin routes
- Role-based admin access
- Admin dashboard with content stats
- Create/edit courses
- Publish/unpublish courses
- Archive/restore courses
- Search/filter admin courses
- Create/edit lessons
- Markdown lesson editor
- Markdown preview
- Lesson content template helper
- Estimated reading time
- Unsaved changes warning
- Publish/unpublish lessons
- Archive/restore lessons
- Search/filter admin lessons

## Tech Stack

- React
- Vite
- JavaScript / JSX
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Zustand
- React Router
- React Markdown
- React Syntax Highlighter
- lucide-react

## Project Structure

```txt
src/
├── app/
├── features/
├── layouts/
├── routes/
├── services/
├── shared/
├── styles/
└── main.jsx