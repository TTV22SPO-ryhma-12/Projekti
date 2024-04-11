import { StyleSheet, View, Text, TextInput, Button, StatusBar, Alert } from 'react-native';
import React from 'react';
import { deleteCurrentUser, auth, deleteUserStorageData } from '../Firebase/FirebaseAuth';



export default function Settings() {

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

    return (
        <View style={styles.home}>
            <Text>Tervetuloa asetuksiin</Text>
            <Button title="Delete Account" onPress={handleDeleteAccount} />
        </View>
    )
}


const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
})