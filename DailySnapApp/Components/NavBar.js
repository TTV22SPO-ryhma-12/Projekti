import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the navigation hook from react-navigation/native


StatusBar.setBarStyle('light-content', true);

const NavBar = ({ isSignedIn, onToggleSignIn, onSignOut }) => {
  const navigation = useNavigation(); // Initialize the navigation object using the hook

  const goToProfile = () => {
    navigation.navigate('Profile'); // Navigate to the 'Profile' screen
    console.log("profile screen opened")
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.navText}>DailySnap</Text>
      {isSignedIn ? (
        <TouchableOpacity onPress={goToProfile}>
          <Image source={require('../assets/login.png')} style={styles.signInImage} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onToggleSignIn}>
          <Image source={require('../assets/login.png')} style={styles.signInImage} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#000',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  navText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 'auto',
    marginLeft: 10,
    color: '#fff'
  },
  signInImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default NavBar;
