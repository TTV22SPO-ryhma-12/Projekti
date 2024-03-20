import React from 'react'; 
import { TouchableOpacity, View, Text, Alert, StyleSheet } from 'react-native'; 



export default function ProfilePage() {

    const handleSignOut = async () => {
        await auth.signOut(); // Ensure 'auth' is defined and imported correctly
    };

    const showModal = () => { // Renamed for clarity
        Alert.alert("Auth App", "Do you really want to logout", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel pressed"), // Corrected 'onpress' to 'onPress'
            },
            { text: "Logout", onPress: handleSignOut }, // Corrected the function name
        ]);
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.navText}>Tervetuloa profiiliisi</Text>
                <TouchableOpacity style={styles.button} onPress={showModal}> {/* Updated to showModal */}
                    <Text style={styles.buttonText}>Sign out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Example styles - adjust as necessary
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
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
    },
});
