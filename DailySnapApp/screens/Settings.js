import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Switch } from 'react-native';
import { deleteUserStorageData, deleteCurrentUser } from '../Firebase/FirebaseAuth';
import { firestore, USERS, doc, setDoc, auth } from '../Firebase/FirebaseConfig';
import { useTheme } from '../Components/ThemeContext';

export default function Settings({ navigation }) {
    // Accessing the dark mode state and toggle function from the ThemeContext
    const { isDarkMode, toggleTheme } = useTheme();

    // State variables for controlling form visibility, new username input, and messages
    const [showForm, setShowForm] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle account deletion
    const handleDeleteAccount = async () => {
        // Confirmation alert before deleting the account
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Account deletion cancelled"),
                    style: "cancel"
                },
                {
                    text: "Delete Account",
                    onPress: async () => {
                        // Deleting user data from storage and Firebase
                        try {
                            const userId = auth.currentUser.uid;
                            await deleteUserStorageData(userId);
                            await deleteCurrentUser();
                            console.log("Account and all data has been deleted successfully");
                        } catch (error) {
                            console.error("Error deleting account:", error.message);
                        }
                    },
                    style: "destructive"
                },
            ]
        );
    };

    // Function to handle updating username
    const handleUpdateUsername = async () => {
        // Validation for empty username
        if (!newUsername.trim()) {
            Alert.alert("Username cannot be empty");
            return;
        }
        try {
            // Updating username in Firestore
            const userDocRef = doc(firestore, USERS, auth.currentUser.uid);
            await setDoc(userDocRef, { username: newUsername }, { merge: true });
            setMessage("Username updated successfully");
            Alert.alert("Username updated successfully");
            navigation.goBack(); // Navigate back after successful update
        } catch (error) {
            console.error("Error updating username:", error.message);
            Alert.alert("Error updating username:", error.message);
        }
    }

    // Function to handle canceling username update
    const handleCancelUpdate = () => {
        setShowForm(false);
        setNewUsername('');
    }

    return (
        // Main view with conditional rendering based on dark mode
        <View style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
            <Text style={[styles.title, isDarkMode ? styles.dark : styles.light]}>Settings</Text>
            <View style={styles.switch}>
                <Text style={[styles.darkmodetext, isDarkMode ? styles.dark : styles.light]}>Dark Mode</Text>
                <Switch
                    trackColor={{ false: "black", true: "white" }}
                    thumbColor={isDarkMode ? "black" : "white"}
                    ios_backgroundColor="#3e3e3e"
                    value={isDarkMode}
                    onValueChange={toggleTheme} />
            </View>
            {showForm ? (
                <View style={[styles.newUsername, isDarkMode ? styles.dark : styles.light]}>
                    <TextInput
                        style={styles.input}
                        placeholder="New Username"
                        onChangeText={setNewUsername}
                        value={newUsername}
                    />
                    <View style={styles.buttonGroup}>
                        <Button title="Change Username" onPress={handleUpdateUsername} />
                        <Button title="Cancel" onPress={handleCancelUpdate} color="red" />
                    </View>
                </View>
            ) : (
                <Button title="Change Username" onPress={() => setShowForm(true)} />
            )}
            {!showForm && <Button title="Delete Account" onPress={handleDeleteAccount} />}
        </View>
    );
}
// Stylesheet for the Settings component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        width: 200,
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        color: '#333',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    switch: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',   
        marginBottom: 20,
    },
    darkmodetext: {
        fontSize: 16,
        marginBottom: 10,

    },
    dark: {
        backgroundColor: '#333',
        color: '#fff',
    },
    light: {
        backgroundColor: '#fff',
        color: '#333',
        textColor: '#333',
    }, 
    newUsername: {
        alignItems: 'center',
        color: '#fff',
    }
});
