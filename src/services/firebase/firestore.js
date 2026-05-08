import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "./config";

/**
 * USERS
 */
export const getUser = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * COURSES
 */
export const getCourses = async () => {
  const coursesRef = collection(db, "courses");

  const q = query(
    coursesRef,
    where("published", "==", true),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getCourseBySlug = async (slug) => {
  const coursesRef = collection(db, "courses");

  const q = query(
    coursesRef,
    where("slug", "==", slug),
    where("published", "==", true)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const courseDoc = snap.docs[0];

  return {
    id: courseDoc.id,
    ...courseDoc.data(),
  };
};

/**
 * LESSONS
 */
export const getLessonsByCourseSlug = async (courseSlug) => {
  const lessonsRef = collection(db, "lessons");

  const q = query(
    lessonsRef,
    where("courseSlug", "==", courseSlug),
    where("published", "==", true)
  );

  const snap = await getDocs(q);

  const lessons = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return lessons.sort((a, b) => a.order - b.order);
};

export const getLessonBySlug = async (courseSlug, lessonSlug) => {
  const lessonsRef = collection(db, "lessons");

  const q = query(
    lessonsRef,
    where("courseSlug", "==", courseSlug),
    where("slug", "==", lessonSlug),
    where("published", "==", true)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const lessonDoc = snap.docs[0];

  return {
    id: lessonDoc.id,
    ...lessonDoc.data(),
  };
};