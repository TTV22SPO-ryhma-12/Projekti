import { StyleSheet, View, TextInput, Button, StatusBar } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, messages, getAuth } from './Firebase/FirebaseConfig';
import { useState } from 'react';
import { RegisterationForm } from './Components/Registeration';
import { getFirestore } from 'firebase/firestore';
import NavBar from './NavBar';
import Constants from 'expo-constants';


export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

getFirestore();

  const [newmessage, setnewmessage] = useState('')

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const handleToggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <View style={styles.container}>
      <RegisterationForm />
       <StatusBar backgroundColor="#000" barStyle="light-content" />
      <NavBar isSignedIn={isSignedIn} onToggleSignIn={handleToggleSignIn} onSignOut={handleSignOut} />
      {showSignIn && <SignIn onSignIn={handleSignIn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
