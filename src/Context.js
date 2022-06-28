import React, { useContext, useState, useEffect } from "react";
import { auth, storage } from "./Firebase";
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

const CSNetwork = React.createContext();

export function useFireContext() {
  return useContext(CSNetwork);
}

export function Context({ children }) {
  const [user, setuser] = useState(null);
  const [admin, setadmin] = useState(false);
  const [loading, setloading] = useState(true);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setuser(user);
      if (user) {
        if (user.email === "admin@cs-network.web.app") {
          setadmin(true);
        }
      }
      setPersistence(auth, browserSessionPersistence);
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
  };

  return (
    <CSNetwork.Provider value={value}>
      {!loading && children}
    </CSNetwork.Provider>
  );
}
