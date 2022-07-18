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
  async function uploadDisplayName(displayName) {
    return updateProfile(user, {
      displayName: displayName,
    });
  }
  async function uploadProfileData(user) {
    const dataRef = doc(db, "users", user.uid);
    if (!user.photoURL) {
      await updateDP(
        "https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png"
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
  async function registerchatbox(userArray) {
    const userCollection = collection(db, "users");
    const boxID = userArray[0] + userArray[1];
    for (const user of userArray) {
      const messageRef = doc(userCollection, user);
      await setDoc(
        messageRef,
        {
          chatbox: arrayUnion(boxID),
        },
        { merge: true }
      );
    }
  }
  async function sendMessage(uid, message) {
    const receiverCollection = collection(db, "chatbox");
    const messageRef = doc(receiverCollection, uid + user.uid);
    const userList = [uid, user.uid];
    const otherDisplayName = await getDisplayName(uid);
    await setDoc(
      messageRef,
      {
        messages: arrayUnion(user.displayName + "_" + message),
        participants: userList,
        name: user.displayName + " & " + otherDisplayName,
      },
      { merge: true }
    );
    return await registerchatbox(userList);
  }
  async function addReply(docID, message) {
    const messageRef = doc(db, "chatbox", docID);
    return await setDoc(
      messageRef,
      {
        messages: arrayUnion(user.displayName + "_" + message),
        sender: user.displayName,
        time: arrayUnion(new Date().toLocaleString()),
      },
      { merge: true }
    );
  }

  async function getInbox(user) {
    var result = [];
    const inboxCollection = collection(db, "chatbox");
    const docs = await getDocs(inboxCollection);
    docs.forEach((doc) => {
      if (doc.id.includes(user.uid)) {
        result.push(doc);
      }
    });
    return result;
  }
  async function getMessages(boxID) {
    const document = doc(db, "chatbox", boxID);
    return await getDoc(document);
  }
  async function addPost(uid, text, adminPost) {
    if (adminPost == null) {
      adminPost = false;
    }
    const docID = new Date().getTime().toString();
    const userCollection = collection(db, "posts");
    const newsfeedCollection = collection(db, "newsfeed");
    const adminCollection = collection(db, "adminPosts");
    const userDoc = doc(userCollection, uid);
    const newsfeedDoc = doc(newsfeedCollection, docID);
    const adminDoc = doc(adminCollection, docID);
    const date = new Date().toLocaleString();
    const userPost = await setDoc(userDoc, {
      uid: uid,
      text: text,
      datePosted: date,
      timestamp: docID,
    });
    if (adminPost) {
      const adminPost = await setDoc(adminDoc, {
        uid: uid,
        text: text,
        datePosted: date,
        timestamp: docID,
      });
    } else {
      const feedPost = await setDoc(newsfeedDoc, {
        uid: uid,
        text: text,
        datePosted: date,
        timestamp: docID,
      });
    }
  }
  async function getProfilePicture(uid) {
    const dataRef = doc(db, "users", uid);
    const data = await getDoc(dataRef);
    const pp = data.data().profilePicture;
    if (pp == null || pp == undefined) {
      pp = "https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png";
    }
    return pp;
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
  async function getUserDetails() {
    const userCollection = collection(db, "users");
    const data = await getDocs(userCollection);
    return data;
  }

  async function addEventData(name, userArray) {
    const dataRef = doc(db, "eventData", name);
    return await setDoc(
      dataRef,
      {
        participants: userArray,
      },
      { merge: true }
    );
  }
  async function getEventData() {
    const dataRef = collection(db, "eventData");
    const data = await getDocs(dataRef);
    return data;
  }
  async function getPosts(type) {
    if (type == "public") {
      const q = getDocs(newsfeedCollection);
      return q;
    }
    if (type == "admin") {
      const q = query(adminCollection, orderBy("datePosted", "desc"));
      return getDocs(q);
    }
  }
  async function updateEventData(docID, userArray) {
    const dataRef = doc(db, "eventData", docID);
    return setDoc(
      dataRef,
      {
        participants: userArray,
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
    uploadDisplayName,
    logOff,
    addPost,
    getPosts,
    getProfilePicture,
    getDisplayName,
    getUserDetails,
    addFriends,
    removeFriends,
    getFriends,
    addEventData,
    updateEventData,
    getEventData,
    sendMessage,
    getInbox,
    addReply,
    getMessages,
  };

  return (
    <CSNetwork.Provider value={value}>
      {!loading && children}
    </CSNetwork.Provider>
  );
}
