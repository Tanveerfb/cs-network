import React, { useContext, useState, useEffect } from "react";
import { auth, storage, db } from "./Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

const CSNetwork = React.createContext();

export function useFireContext() {
  return useContext(CSNetwork);
}

export function Context({ children }) {
  const [user, setuser] = useState(null);
  const [admin, setadmin] = useState(false);
  const [loading, setloading] = useState(true);
  const newsfeedCollection = collection(db, "newsfeed");
  const adminCollection = collection(db, "adminPosts");

  function signupusingEmailandPassword(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function loginusingEmailandPassword(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function updateDP(URL) {
    return updateProfile(user, {
      photoURL: URL,
    });
  }
  async function uploadDP(file) {
    const docRef = ref(storage, user.uid);
    await uploadBytes(docRef, file);
    const downloadURL = await getDownloadURL(docRef);
    updateDP(downloadURL);
  }
  function logOff() {
    return signOut(auth);
  }
  async function uploadProfileData(displayName) {
    return updateProfile(user, {
      displayName: displayName,
    });
  }
  async function uploadProfileData(user) {
    const dataRef = doc(db, "users", user.uid);
    if (user.photoURL == null) {
      await updateDP(
        "https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png"
      );
    }
    return setDoc(
      dataRef,
      {
        displayName: user.displayName,
        profilePicture: user.photoURL,
        email: user.email,
      },
      { merge: true }
    );
  }
  async function addFriends(uid) {
    const dataRef = doc(db, "friendlists", user.uid);
    return setDoc(
      dataRef,
      {
        friends: arrayUnion(uid),
      },
      { merge: true }
    );
  }
  async function removeFriends(uid) {
    const dataRef = doc(db, "friendlists", user.uid);
    return setDoc(
      dataRef,
      {
        friends: arrayRemove(uid),
      },
      { merge: true }
    );
  }
  async function sendMessage(uid, message) {
    const receiverCollection = collection(db, "users", uid, "messages");
    const messageID = new Date().getTime().toString();
    const messageRef = doc(receiverCollection, messageID);
    return await setDoc(messageRef, {
      message: message,
      sender: user.uid,
      time: new Date().toLocaleString(),
    });
  }
  async function addPost(uid, text, adminPost) {
    if (adminPost == null) {
      adminPost = false;
    }
    const docID = new Date().getTime().toString();
    const userCollection = collection(db, "posts");
    const newsfeedCollection = collection(db, "newsfeed");
    const adminCollection = collection(db, "adminPosts");
    const userDoc = doc(userCollection, docID);
    const newsfeedDoc = doc(newsfeedCollection, docID);
    const adminDoc = doc(adminCollection, docID);
    const userPost = await setDoc(userDoc, {
      uid: uid,
      text: text,
      datePosted: new Date().toLocaleString(),
      timestamp: docID,
    });
    if (adminPost) {
      const adminPost = await setDoc(adminDoc, {
        uid: uid,
        text: text,
        datePosted: new Date().toLocaleString(),
        timestamp: docID,
      });
    } else {
      const feedPost = await setDoc(newsfeedDoc, {
        uid: uid,
        text: text,
        datePosted: new Date().toLocaleString(),
        timestamp: docID,
      });
    }
  }
  async function getProfilePicture(uid) {
    const dataRef = doc(db, "users", uid);
    const data = await getDoc(dataRef);
    return data.data().profilePicture;
  }
  async function getDisplayName(uid) {
    const dataRef = doc(db, "users", uid);
    const data = await getDoc(dataRef);
    return data.data().displayName;
  }
  async function getFriends(uid) {
    const dataRef = doc(db, "friendlists", uid);
    const data = await getDoc(dataRef);
    return data.data().friends;
  }

  async function getMarks(uid) {
    const dataRef = doc(db, "marks", uid);
    const data = await getDoc(dataRef);
    return data;
  }
  async function getPosts(type) {
    if (type == "public") {
      const q = query(
        newsfeedCollection,
        orderBy("timestamp", "desc"),
        limit(10)
      );
      return getDocs(q);
    }
    if (type == "admin") {
      const q = query(adminCollection, orderBy("datePosted", "desc"));
      return getDocs(q);
    }
  }
  async function getUserDetails() {
    const userCollection = collection(db, "users");
    const data = await getDocs(userCollection);
    return data;
  }
  async function updateMarks(UID, marksheet) {
    const dataRef = doc(db, "marks", UID);
    return setDoc(
      dataRef,
      {
        marks: marksheet,
      },
      { merge: true }
    );
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setuser(user);
      if (user) {
        if (user.email === "admin@cs-network.web.app") {
          setadmin(true);
        }
      }
      uploadProfileData(user);
      // setPersistence(auth, browserSessionPersistence);
      setloading(false);
    });

    return unsubscribe;
  }, []);
  const value = {
    user,
    admin,
    loginusingEmailandPassword,
    signupusingEmailandPassword,
    updateDP,
    uploadDP,
    uploadProfileData,
    logOff,
    addPost,
    getPosts,
    getProfilePicture,
    getDisplayName,
    getUserDetails,
    addFriends,
    removeFriends,
    getFriends,
    updateMarks,
    getMarks,
    sendMessage,
  };

  return (
    <CSNetwork.Provider value={value}>
      {!loading && children}
    </CSNetwork.Provider>
  );
}
