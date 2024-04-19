import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import { deleteUserStorageData, deleteCurrentUser } from '../Firebase/FirebaseAuth';
import { firestore, USERS, doc, setDoc, auth } from '../Firebase/FirebaseConfig';

export default function Settings({ navigation }) {
    const [showForm, setShowForm] = useState(false);
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

    const handleCancelUpdate = () => {
        setShowForm(false);
        setNewUsername('');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            {showForm ? (
                <View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
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
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
