import { fetchAdminCourses } from "./adminCoursesApi";
import { fetchAdminLessons } from "./adminLessonsApi";

export const fetchAdminContentStats = async () => {
  const [courses, lessons] = await Promise.all([
    fetchAdminCourses(),
    fetchAdminLessons(),
  ]);

  const courseStats = {
    total: courses.length,
    published: courses.filter((course) => course.published && !course.archived)
      .length,
    drafts: courses.filter((course) => !course.published && !course.archived)
      .length,
    archived: courses.filter((course) => course.archived).length,
  };

  const lessonStats = {
    total: lessons.length,
    published: lessons.filter((lesson) => lesson.published && !lesson.archived)
      .length,
    drafts: lessons.filter((lesson) => !lesson.published && !lesson.archived)
      .length,
    archived: lessons.filter((lesson) => lesson.archived).length,
  };

  return {
    courses: courseStats,
    lessons: lessonStats,
  };
};