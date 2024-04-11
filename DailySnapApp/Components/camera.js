import React from 'react';
import { Text, View, StyleSheet, Button, StatusBar, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadToFirebase, auth } from '../Firebase/FirebaseAuth';

function CameraComponent() {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();


  const takePicture = async () => {
    if (permission?.status === ImagePicker.PermissionStatus.GRANTED) {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        const { uri } = cameraResp.assets[0]
        const fileName = uri.split('/').pop();
        const uploadResp = await uploadToFirebase(uri, `${auth.currentUser.uid}/${fileName}`);
        console.log(uploadResp);

      }
    } else {
      console.log("Camera permission is not granted");
      requestPermission();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {permission?.status === ImagePicker.PermissionStatus.GRANTED ? (
        <TouchableOpacity onPress={takePicture}>
          <Image source={require('../assets/camera.png')} style={styles.cameraIcon} />
        </TouchableOpacity>
      ) : (
        <View>
          <Text>No access to camera. Need permission.</Text>
          <Button title="Request permission" onPress={requestPermission} />
        </View>
      )}
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
});

export {
  CameraComponent
};
