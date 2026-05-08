import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

import { db } from "./config";

/**
 * USERS
 */
export const createUserProfile = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // Do not overwrite existing profile
  if (userSnap.exists()) {
    return {
      id: userSnap.id,
      ...userSnap.data(),
    };
  }

  const usernameBase =
    user.displayName?.toLowerCase().replace(/\s+/g, "") ||
    user.email?.split("@")[0] ||
    "user";

  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    username: usernameBase,
    photoURL: user.photoURL || "",
    role: "student",
    bio: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(userRef, newUser);

  return {
    id: user.uid,
    ...newUser,
  };
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  return {
    id: userSnap.id,
    ...userSnap.data(),
  };
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(),
  });
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

/**
 * BOOKMARKS
 */
export const getUserBookmarks = async (userId) => {
  const bookmarksRef = collection(db, "bookmarks");

  const q = query(bookmarksRef, where("userId", "==", userId));

  const snap = await getDocs(q);

  const bookmarks = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return bookmarks.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(0);
    const dateB = b.createdAt?.toDate?.() || new Date(0);

    return dateB - dateA;
  });
};

export const getLessonBookmark = async (userId, lessonId) => {
  const bookmarksRef = collection(db, "bookmarks");

  const q = query(
    bookmarksRef,
    where("userId", "==", userId),
    where("lessonId", "==", lessonId)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const bookmarkDoc = snap.docs[0];

  return {
    id: bookmarkDoc.id,
    ...bookmarkDoc.data(),
  };
};

export const createLessonBookmark = async (bookmarkData) => {
  const bookmarksRef = collection(db, "bookmarks");

  const docRef = await addDoc(bookmarksRef, {
    ...bookmarkData,
    createdAt: new Date(),
  });

  return {
    id: docRef.id,
    ...bookmarkData,
  };
};

export const deleteLessonBookmark = async (bookmarkId) => {
  const bookmarkRef = doc(db, "bookmarks", bookmarkId);

  await deleteDoc(bookmarkRef);
};