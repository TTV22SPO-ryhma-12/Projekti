import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Alert, StyleSheet, Image, ScrollView, Dimensions, Modal } from 'react-native';
import { getAuth } from 'firebase/auth';
import { fetchImages } from '../Firebase/FirebaseAuth';

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
        // Navigate to the settings screen
        navigation.navigate('Settings');
    };

    const openImage = (url) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    return (
        <View style={styles.container}>
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
        color: '#fff',
        fontSize: 16,
    },
});

export default ProfilePage;
