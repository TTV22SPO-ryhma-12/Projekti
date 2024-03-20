import { StyleSheet, View, TextInput, Button, StatusBar } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, messages, getAuth, auth } from './Firebase/FirebaseConfig';
import { useState, useEffect } from 'react';
import { RegisterationForm } from './screens/Registeration';
import NavBar from './Components/NavBar';
import { LoginForm } from './screens/Login';
import { CameraComponent } from './Components/camera';
import { onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user) // User is signed in if `user` is not null
    });

    return () => unsubscribe() // Cleanup subscription
  }, [])

  const handleSignOut = async () => {
    await auth.signOut()
    // `isSignedIn` will automatically be set to false by the auth listener
  }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});