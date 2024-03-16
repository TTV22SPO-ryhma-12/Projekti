import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import NavBar from './NavBar';
import Constants from 'expo-constants';


export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignIn = () => {
    // Your sign-in logic here
    // For simplicity, I'm just setting isSignedIn to true
    setIsSignedIn(true);
    setShowSignIn(false);
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  const handleToggleSignIn = () => {
    setShowSignIn(!showSignIn);
  };

  return (
    <View style={styles.container}>
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
