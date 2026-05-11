import {
  createCourse,
  getAllCoursesForAdmin,
  updateCourse,
  deleteCourse,
} from "@/services/firebase/firestore";

export const fetchAdminCourses = async () => {
  return getAllCoursesForAdmin();
};

export const createAdminCourse = async (courseData) => {
  return createCourse(courseData);
};

export const updateAdminCourse = async (courseId, courseData) => {
  return updateCourse(courseId, courseData);
};

export const deleteAdminCourse = async (courseId) => {
  return deleteCourse(courseId);
};