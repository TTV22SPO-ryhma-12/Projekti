import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet, Image, ScrollView, Dimensions, Modal } from 'react-native';
import { getAuth } from 'firebase/auth';
import { fetchImages, deleteImage } from '../Firebase/FirebaseAuth'; // Import the deleteImage function
import Constants from 'expo-constants';

const auth = getAuth();

function ProfilePage({ navigation }) {
    const [imageUrls, setImageUrls] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchAndSetImages = async () => {
            try {
                const urls = await fetchImages(`images/${auth.currentUser.uid}`);
                setImageUrls(urls);
            } catch (error) {
                console.error("Error fetching images:", error.message);
            }
        };
        fetchAndSetImages();
    }, []);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

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
        // Display a confirmation alert before deleting the image
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
    
                            setImageUrls(prevUrls => prevUrls.filter(url => url !== selectedImage));

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
        <View style={styles.container}>
            <View style={styles.userInfoContainer}>
                <Text style={styles.usernameText}>Username</Text>
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
                {imageUrls.map((url, index) => (
                    <TouchableOpacity key={index} onPress={() => openImage(url)}>
                        <Image source={{ uri: url }} style={styles.imageThumbnail} />
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
});

export default ProfilePage;
