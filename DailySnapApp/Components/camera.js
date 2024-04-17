import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, StatusBar, TouchableOpacity, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase, auth } from '../Firebase/FirebaseAuth';
import { useNavigation } from '@react-navigation/native';

function CameraComponent() {
  const [imageUri, setImageUri] = useState(null); 
  const navigation = useNavigation();

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert("We need to access your camera to take a picture");
      return;
      }

      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      })
      console.log("Camera response:", cameraResp);

      if (!cameraResp.canceled && cameraResp.assets && cameraResp.assets.length > 0) {
        const uri = cameraResp.assets[0].uri;
        setImageUri(uri); 
        console.log("Image URI:", uri);
        navigation.navigate('Editor', { imageUri: uri });
      } else {
        console.log("Camera use was cancelled or no image was taken");
      }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <TouchableOpacity onPress={takePicture}>
          <Image source={require('../assets/camera.png')} style={styles.cameraIcon} />
        </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 50,
    height: 50,
  },
  preview: {
    width: 300,
    height: 300,
  },
});

export {
  CameraComponent
};
