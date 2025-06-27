import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { auth, db } from '../firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

const clientId = '222585366862-hd39fjkof4cbo0gnfr37nrk3dgph11t2.apps.googleusercontent.com';
const redirectUri = makeRedirectUri({
  scheme: 'allergyguard'
});

// Handle Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent('profile email')}`;

    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

    if (result.type === 'success') {
      const { access_token } = result.params;
      
      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credential(null, access_token);
      
      // Sign in with the credential
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
          provider: 'google'
        });
      }

      return user;
    } else {
      throw new Error('Google sign in was cancelled or failed');
    }
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Sign out from Google
export const signOutFromGoogle = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Google Sign-Out Error:', error);
    throw error;
  }
}; 