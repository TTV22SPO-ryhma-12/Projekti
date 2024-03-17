import { StyleSheet, View, TextInput, Button, StatusBar } from 'react-native';
import { useState } from 'react';
import { RegisterationForm } from './Components/Registeration';
import NavBar from './NavBar';


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
      {showSignIn && <RegisterationForm onSignIn={handleToggleSignIn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
