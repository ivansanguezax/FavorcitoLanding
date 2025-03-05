import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbFqrDFLod7_lp52aT5vAXF81Y8dkbT-4",
  authDomain: "favorcito-web-bucle.firebaseapp.com",
  projectId: "favorcito-web-bucle",
  storageBucket: "favorcito-web-bucle.firebasestorage.app",
  messagingSenderId: "827691227088",
  appId: "1:827691227088:web:a8a57ed7c07e50f5b1cbd5",
  measurementId: "G-TLM3Q1BJ56",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

const authService = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      const user = result.user;

      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        })
      );

      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        token,
      };
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  checkAuthState: () => {
    return new Promise((resolve) => {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        resolve(JSON.parse(storedUser));
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          const userData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };

          localStorage.setItem("authUser", JSON.stringify(userData));
          resolve(userData);
        } else {
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          resolve(null);
        }
      });
    });
  },

  getCurrentUser: () => {
    const storedUser = localStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  },

  checkUserExists: async (email) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/students/getInfo?email=${email}`
      );

      if (!response.ok) {
        if (response.status !== 404) {
          throw new Error(`Error checking user: ${response.status}`);
        }
        return false;
      }

      const data = await response.json();
      return data.success && data.data;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      return false;
    }
  },
};

export default authService;
