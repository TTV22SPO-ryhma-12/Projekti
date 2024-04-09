import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, StatusBar } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/FirebaseConfig';
import NavBar from './Components/NavBar';
import LoginForm from './screens/Login';
import Home from './screens/Home';
import ProfilePage from './screens/ProfilePage';

// Create a stack navigator
const Stack = createStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user); // User is signed in if `user` is not null
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const handleSignIn = () => {
    // This function might not be necessary as your LoginForm component should handle the sign-in logic
    // But you can use it to toggle additional UI elements or functionality after sign-in, if needed
  };

  const handleSignOut = async () => {
    await auth.signOut();
    // `isSignedIn` will automatically be set to false by the auth listener
  };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={ProfilePage} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginForm} />
          )}
        </Stack.Navigator>
        <NavBar isSignedIn={isSignedIn} onToggleSignIn={handleSignIn} onSignOut={handleSignOut} />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
