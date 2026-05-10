import {
  getLessonProgress,
  getUserCourseProgress,
  markLessonComplete,
  unmarkLessonComplete,
} from "@/services/firebase/firestore";

export const fetchUserCourseProgress = async (userId, courseSlug) => {
  return getUserCourseProgress(userId, courseSlug);
};

export const fetchLessonProgress = async (userId, lessonId) => {
  return getLessonProgress(userId, lessonId);
};

export const completeLesson = async (progressData) => {
  return markLessonComplete(progressData);
};

export const undoLessonComplete = async (progressId) => {
  return unmarkLessonComplete(progressId);
};