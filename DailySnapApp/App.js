import { StyleSheet, View, TextInput, Button, StatusBar } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, messages, getAuth, auth } from './Firebase/FirebaseConfig';
import { useState, useEffect } from 'react';
import { RegisterationForm } from './screens/Registeration';
import NavBar from './Components/NavBar';
import { LoginForm } from './screens/Login';
import { CameraComponent } from './Components/camera';
import { onAuthStateChanged } from 'firebase/auth';
import ProfilePage from './screens/ProfilePage';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user) // User is signed in if `user` is not null
    });

    return () => unsubscribe() // Cleanup subscription
  }, [])

  const handleSignIn = () => {
    // This function might not be necessary as your LoginForm component should handle the sign-in logic
    // But you can use it to toggle additional UI elements or functionality after sign-in, if needed
  };

  const handleSignOut = async () => {
    await auth.signOut()
    // `isSignedIn` will automatically be set to false by the auth listener
  }


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <NavBar isSignedIn={isSignedIn} onToggleSignIn={handleSignIn} onSignOut={handleSignOut} />
      {isSignedIn ? (
       <ProfilePage />
      ) : (
        <LoginForm onSignInSuccess={() => setIsSignedIn(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});