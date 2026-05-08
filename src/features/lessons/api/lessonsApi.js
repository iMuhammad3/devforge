import {
  getLessonBySlug,
  getLessonsByCourseSlug,
} from "@/services/firebase/firestore";

export const fetchLessonsByCourseSlug = async (courseSlug) => {
  return getLessonsByCourseSlug(courseSlug);
};

export const fetchLessonBySlug = async (courseSlug, lessonSlug) => {
  return getLessonBySlug(courseSlug, lessonSlug);
};