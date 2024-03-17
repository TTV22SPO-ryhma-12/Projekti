import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar } from 'react-native';
import Constants from 'expo-constants';

StatusBar.setBarStyle('light-content', true);

const NavBar = ({ isSignedIn, onToggleSignIn, onSignOut }) => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.navText}>DailySnap</Text>
      {isSignedIn ? (
        <TouchableOpacity onPress={onSignOut}>
          <Text style={styles.navButton}>Kirjaudu ulos</Text>
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
    paddingTop: Constants.statusBarHeight,
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
  navButton: {
    fontSize: 16,
    color: 'blue',
    marginRight: 10,
  },
  signInImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});

export default NavBar;
