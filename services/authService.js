import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

/**
 * Sends a password reset email to the specified email address
 * @param {string} email - The email address to send the reset link to
 * @returns {Promise} A promise that resolves when the email is sent
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerUser = async (email, password, userType) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      userType: userType, // 'user' or 'expert'
      createdAt: new Date().toISOString(),
      allergies: [], // Array to store user's allergies
      profileCompleted: false
    });

    return { success: true, user };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    return { 
      success: true, 
      user: {
        ...user,
        userType: userData?.userType || 'user'
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    throw new Error('User profile not found');
  } catch (error) {
    throw new Error(error.message);
  }
}; 