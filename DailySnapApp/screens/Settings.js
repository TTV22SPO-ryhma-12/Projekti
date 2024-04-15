import { StyleSheet, View, Text, TextInput, Button, StatusBar, Alert } from 'react-native';
import React from 'react';
import { deleteCurrentUser, auth, deleteUserStorageData } from '../Firebase/FirebaseAuth';
import { firestore, USERS, doc, setDoc } from '../Firebase/FirebaseConfig';
import { useState } from 'react';



export default function Settings({ navigation }) {
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleDeleteAccount = async () => {
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

    const handleUpdateUsername = async () => {
        if (!newUsername.trim()) {
            Alert.alert("Username cannot be empty");
            return;
        }
        Alert.alert(
            "Confirm",
            "Are you sure you want to change your username?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Username change cancelled"),
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: async () => {
                        try {
                            const userDocRef = doc(firestore, USERS, auth.currentUser.uid);
                            await setDoc(userDocRef, { username: newUsername }, { merge: true });
                            setMessage("Username updated successfully");
                            Alert.alert("Username updated successfully");
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error updating username:", error.message);
                            Alert.alert("Error updating username:", error.message);
                        }
                    }

                }
            ]
        );
    }

    return (
        <View style={styles.home}>
            <Text style={styles.text}>Tervetuloa asetuksiin</Text>
            <TextInput
                style={styles.input}
                placeholder="New Username"
                onChangeText={setNewUsername}
                value={newUsername}
            />
            <Button style={styles.Ubutton} title="Change username" onPress={handleUpdateUsername} />
            <Button style={styles.Dbutton} title="Delete Account" onPress={handleDeleteAccount} />
        </View>
    )
}


const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        color: 'black',
    },
    input: {
        width: 200,
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    Ubutton: {
        backgroundColor: 'blue',
        color: 'white',
    },
    Dbutton: {
        backgroundColor: 'black',
        color: 'black',
    },
})