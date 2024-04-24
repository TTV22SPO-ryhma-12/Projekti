import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { uploadToFirebase} from '../Firebase/FirebaseAuth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/FirebaseConfig';
import { useTheme } from '../Components/ThemeContext';

export default function Editor({ route }) {
  // Accessing the dark mode state from the ThemeContext
  const { isDarkMode } = useTheme();

  // Extracting imageUri from the route params
  const { imageUri } = route.params;

  // State variables for caption input, loading state, and upload progress
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Accessing navigation object for navigation actions
  const navigation = useNavigation();

  // Function to upload image to Firebase
  const uploadImage = async () => {
    console.log("Upload started...");
    setIsLoading(true);
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    if (!userId) {
      console.error("User not logged in");
      setIsLoading(false);
      return;
    }
    try {
      // Function to track upload progress
      const progressHandler = (progress) => {
        setUploadProgress(progress);
      };

      // Uploading image to Firebase and getting back image URLs
      const { allImageUrl } = await uploadToFirebase(imageUri, userId, caption, progressHandler);
      console.log("Image URLs:", allImageUrl);
      navigation.goBack(); // Navigate back after successful upload
    } catch (error) {
      console.error("Upload error:", error);
    }
    setIsLoading(false);
  };

  return (
    // Main view with conditional styling based on dark mode
    <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Enter a caption..."
        value={caption}
        onChangeText={setCaption}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Upload" onPress={uploadImage} />
      )}
    </View>
  );
}

// Stylesheet for the Editor component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 400,
  },
  input: {
    height: 40,
    marginVertical: 20,
    borderWidth: 1,
    width: '100%',
    padding: 10,
  },
  dark: {
    backgroundColor: '#333',
    color: '#fff',
  },
  light: {
    backgroundColor: '#fff',
    color: '#000',
  },
});

export { Editor };