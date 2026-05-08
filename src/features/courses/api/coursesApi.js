import { getCourseBySlug, getCourses } from "@/services/firebase/firestore";

export const fetchCourses = async () => {
  return getCourses();
};

export const fetchCourseBySlug = async (slug) => {
  return getCourseBySlug(slug);
};