import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { CameraComponent } from './camera';

StatusBar.setBarStyle('light-content', true);

const NavBar = ({ isSignedIn, onToggleSignIn, onSignOut }) => {
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.navText}>DailySnap</Text>

      {isSignedIn && (
        <TouchableOpacity style={styles.cameraContainer}>
          <CameraComponent />
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={isSignedIn ? goToProfile : onToggleSignIn}>
        <Image source={require('../assets/login.png')} style={styles.signInImage} />
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    height: 60,
    paddingHorizontal: 10,
  },
  navText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
    flex: 1,
  },
  signInImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cameraContainer: {
    width: 60,
    height: 60,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }],
  },
});

export default NavBar;