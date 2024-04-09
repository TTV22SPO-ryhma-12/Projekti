import React from 'react';
import { Text, View, StyleSheet, Button, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {uploadToFirebase, auth} from '../Firebase/FirebaseAuth';

function CameraComponent() {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  
  // Function to handle taking a picture
  const takePicture = async () => {
    // Ensure permissions are granted before launching the camera
    if (permission?.status === ImagePicker.PermissionStatus.GRANTED) {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0]
        const fileName = uri.split('/').pop();
        const uploadResp =  await uploadToFirebase(uri, `${auth.currentUser.uid}/${fileName}`);
        console.log(uploadResp);
        // Here you might want to set state with the image URI, display it, or upload it to Firebase
      }
    } else {
      // If permissions are not granted, request them
      console.log("Camera permission is not granted");
      requestPermission();
    }
  };

  // Component rendering
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {permission?.status === ImagePicker.PermissionStatus.GRANTED ? (
        <Button title="Take a picture" onPress={takePicture} />
      ) : (
        <View>
          <Text>No access to camera. Need permission.</Text>
          <Button title="Request permission" onPress={requestPermission} />
        </View>
      )}
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { 
  CameraComponent
  };