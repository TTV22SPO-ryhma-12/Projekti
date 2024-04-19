import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet, Image, ScrollView, Dimensions, Modal } from 'react-native';
import { fetchImages, deleteImage, fetchUsername, getUsername, uploadProfilePicture, fetchProfileImage } from '../Firebase/FirebaseAuth';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { auth } from '../Firebase/FirebaseConfig';
import { useTheme } from '../Components/ThemeContext';



function ProfilePage({ navigation }) {
    const { isDarkMode, toggleTheme } = useTheme();

    const [imageUrls, setImageUrls] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        const fetchImagesFromFirebase = async () => {
          try {
                const images = await fetchImages(`images/${auth.currentUser.uid}`);
                setImageUrls(images);
            } catch (error) {
                console.error("Error fetching images:", error.message);
            }
        };
        fetchImagesFromFirebase();
    }, []);



    useEffect(() => {
        const getusername = async () => {
            const user = auth.currentUser.uid;
            if (user) {
                const username = await getUsername(user);
                console.log('username', username);
                setUsername(username);
        }
        }
        getusername();
    } , []);


    const handleSignOut = async () => {
        try {
            await auth.signOut();
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log("prrofffiili kuva juttu", result.uri);

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            uploadProfilePicture(uri, auth.currentUser.uid).catch(console.error)
            .then(() => setProfileImage(uri))
            .catch(error => console.error('Error uploading profile picture:', error));
    };
    };

    
    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const profileImage = await fetchProfileImage(auth.currentUser.uid);
                if(profileImage) {
                    setProfileImage(profileImage);
                }
            } catch (error) {
                console.error("Error fetching profile image:", error.message);
            }
        };
        fetchProfilePicture();
    }, []);




    const showModal = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Sign out canceled"),
                    style: "cancel"
                },
                {
                    text: "Sign Out",
                    onPress: handleSignOut,
                    style: "destructive"
                }
            ]
        );
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
        console.log("settings screen opened")
    };

    const openImage = (url) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    const handleDeleteImage = () => {
        Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion canceled"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteImage(selectedImage);
    
                            setImageUrls(prevImages => prevImages.filter(image => image.url !== selectedImage));

                            setModalVisible(false);
    
                            Alert.alert("Image Deleted", "The image has been successfully deleted.");
                        } catch (error) {
                            console.error("Error deleting image:", error.message);
                            Alert.alert("Error", "An error occurred while deleting the image. Please try again later.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };
    
    

    return (
        <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
            <View style={[styles.userInfoContainer, isDarkMode ? styles.dark : styles.light]}>
                <Text style={[styles.usernameText, isDarkMode ? styles.dark : styles.light]}>{username}</Text>
                <View style={styles.profileImageContainer}>
                  <Image source={{ uri: profileImage || "no image"}} style={styles.profileImage} />
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.changeProfileImageText}>Change Profile Image</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleSettings}>
                        <Text style={styles.buttonText}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={showModal}>
                        <Text style={styles.buttonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.imageGrid}>
                {imageUrls.map((image, index) => (
                    <TouchableOpacity key={index} onPress={() => openImage(image.url)}>
                        <Image source={{ uri: image.url }} style={styles.imageThumbnail} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
                    <TouchableOpacity onPress={handleDeleteImage} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    userInfoContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    usernameText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 5,
    },
    imageThumbnail: {
        width: Dimensions.get('window').width / 3 - 10,
        height: Dimensions.get('window').width / 3 - 10,
        marginBottom: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.9)',
    },
    modalImage: {
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').height - 100,
    },
    closeButton: {
        position: 'absolute',
        top: 30,
        right: 20,
        zIndex: 999,
    },
    closeButtonText: {
        paddingTop: Constants.statusBarHeight,
        color: '#fff',
        fontSize: 16,
    },
    deleteButton: {
        position: 'absolute',
        bottom: 30,
        backgroundColor: '#ff0000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 80,
        marginBottom: 20,
        borderWidth: 3,
    },
    changeProfileImageText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    dark: {
        backgroundColor: '#333',
        color: '#fff',
    },
    light: {
        backgroundColor: '#fff',
        color: '#333',
    },
});

export default ProfilePage;