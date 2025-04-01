// src/Login.js
import React from 'react';
import { auth, googleProvider, firestore } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function Login() {
  const signInWithGoogle = async () => {
    try {
      // Use the modular signInWithPopup function
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Using the modular API: get a document reference
      const userRef = doc(firestore, `users/${user.uid}`);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        // New user: set initial data
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          balance: 100000,  // Starting balance
          portfolio: []     // Empty portfolio
        });
      }
      console.log("Signed in as:", user.displayName);
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default Login;