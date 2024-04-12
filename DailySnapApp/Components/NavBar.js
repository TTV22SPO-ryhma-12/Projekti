import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useTheme } from './ThemeContext';


StatusBar.setBarStyle('light-content', true);

const NavBar = ({ isSignedIn, onToggleSignIn, onSignOut }) => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  const goToProfile = () => {

    navigation.navigate('Profile');
  };

  return (
    <View style={[styles.navbar, { backgroundcolor: isDarkMode ? '#333' : '#000'}]}>
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
    borderBottomColor: '#fff',
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
    width: 32,
    height: 32,
    marginRight: 20,
  },
});

export default NavBar;
