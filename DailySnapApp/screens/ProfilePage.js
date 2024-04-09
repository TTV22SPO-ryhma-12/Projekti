import React from 'react'; 
import { TouchableOpacity, View, Text, Alert, StyleSheet } from 'react-native'; 
import { getAuth } from 'firebase/auth';

const auth = getAuth();

function ProfilePage({ navigation }) { // Pass the navigation prop
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
        <View style={styles.container}>
            <Text style={styles.navText}>Welcome to your profile</Text>
            <TouchableOpacity style={styles.button} onPress={showModal}>
                <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSettings}>
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
});

export default ProfilePage;
