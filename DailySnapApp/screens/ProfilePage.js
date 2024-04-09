import React from 'react'; 
import { TouchableOpacity, View, Text, Alert, StyleSheet, Image, ScrollView } from 'react-native'; 
import { getAuth } from 'firebase/auth';
import {useState, useEffect} from 'react';
import { fetchImages } from '../Firebase/FirebaseAuth';


const auth = getAuth();

function ProfilePage({ navigation }) { // Pass the navigation prop
    const [imageUrls, setImageUrls] = useState([]);

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

    return (
        <ScrollView pagingEnabled={true} horizontal={false} contentContainerStyle={styles.container}>
            {imageUrls.map((url, index)=> (
                <Image key={index} source={{ uri: url }} style={styles.image} />
            ))}
            </ScrollView>
            
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
    },
    navText: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10, 
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
    },
    image: {
        width: 400,
        height: 400,
        margin: 5,
    },
});

export default ProfilePage;
