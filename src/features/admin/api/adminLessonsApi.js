import {
  createLesson,
  getAllLessonsForAdmin,
  getLessonById,
  updateLesson,
} from "@/services/firebase/firestore";

export const fetchAdminLessons = async () => {
  return getAllLessonsForAdmin();
};

export const createAdminLesson = async (lessonData) => {
  return createLesson(lessonData);
};

export const fetchAdminLessonById = async (lessonId) => {
  return getLessonById(lessonId);
};

export const updateAdminLesson = async (lessonId, lessonData) => {
  return updateLesson(lessonId, lessonData);
};