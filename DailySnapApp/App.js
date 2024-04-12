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
import  RegistrationForm  from './screens/Registeration'; 
import Settings from './screens/Settings';
import { ThemeProvider, useTheme } from './Components/ThemeContext';


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
    <ThemeProvider>
    <NavigationContainer theme={styles.DarkTheme}>
      <View style={styles.container}>
        <StatusBar  />
        <Stack.Navigator >
          {isSignedIn ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={ProfilePage} />
              <Stack.Screen name="Settings" component={Settings} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginForm} />
              <Stack.Screen name="Register" component={RegistrationForm} /> 
            </>
          )}
        </Stack.Navigator>
        <NavBar isSignedIn={isSignedIn} onToggleSignIn={handleSignIn} onSignOut={handleSignOut} />
      </View>
    </NavigationContainer>
    </ThemeProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  DarkTheme: {
    dark: true,
    colors: {
      primary: 'white',
      background: 'black',
      card: 'black',
      text: 'white',
      border: 'black',
      notification: 'red',
    },
  },
});
