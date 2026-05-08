import {
  createLessonBookmark,
  deleteLessonBookmark,
  getLessonBookmark,
  getUserBookmarks,
} from "@/services/firebase/firestore";

export const fetchUserBookmarks = async (userId) => {
  return getUserBookmarks(userId);
};

export const fetchLessonBookmark = async (userId, lessonId) => {
  return getLessonBookmark(userId, lessonId);
};

export const addLessonBookmark = async (bookmarkData) => {
  return createLessonBookmark(bookmarkData);
};

export const removeLessonBookmark = async (bookmarkId) => {
  return deleteLessonBookmark(bookmarkId);
};