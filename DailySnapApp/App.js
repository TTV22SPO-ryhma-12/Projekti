import { StyleSheet, View, TextInput, Button, StatusBar } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, messages, getAuth } from './Firebase/FirebaseConfig';
import { useState } from 'react';
import { RegisterationForm } from './screens/Registeration';
import NavBar from './Components/NavBar';
import { LoginForm } from './screens/Login';

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const handleToggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <View style={styles.container}>
      <NavBar isSignedIn={isSignedIn} onToggleSignIn={handleToggleSignIn} onSignOut={handleSignOut} />

       <StatusBar backgroundColor="#000" barStyle="light-content" />
      {showSignIn && <LoginForm onSignIn={handleToggleSignIn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});