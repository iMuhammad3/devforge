import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "./config";

/**
 * USERS
 */
export const createUser = async (user) => {
  return setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: new Date(),
  });
};

export const getUser = async (uid) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

/**
 * COURSES
 */
export const getCourses = async () => {
  const snap = await getDocs(collection(db, "courses"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getCourseBySlug = async (slug) => {
  const q = query(collection(db, "courses"), where("slug", "==", slug));
  const snap = await getDocs(q);

  return snap.docs.length ? snap.docs[0].data() : null;
};