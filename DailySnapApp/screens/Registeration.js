import React, { useState } from 'react';
import { getAuth } from "firebase/auth";
import { SafeAreaView, Text, View, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { signUpWithEmailAndPassword } from '../Firebase/FirebaseAuth';
import { firestore, collection, addDoc, doc, setDoc, getDoc, ref, USERS } from '../Firebase/FirebaseConfig';
import { useTheme } from '../Components/ThemeContext';

const auth = getAuth();

function RegistrationForm() {
    const { isDarkMode } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [username , setUsername] = useState('')

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const user = await signUpWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, USERS, user.uid), {
                username: username,
                email: email,
            });
            setSuccessMessage('User has been registered');
            console.log('rekisteröinti onnistui')

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
            <View>
                <Text style={[styles.heading, isDarkMode ? styles.dark : styles.light]}>Registration</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    onChangeText={setUsername}
                    value={username}
                    accessibilityLabel="Username Input"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                    accessibilityLabel="Email Input"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                    accessibilityLabel="Password Input"
                />
                <Button
                    title={loading ? "Registering..." : "Register"}
                    onPress={handleSubmit}
                    disabled={loading}
                    accessibilityLabel="Register Button"
                />
                {error && <Text style={styles.error}>{error}</Text>}
                {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 1,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 2,
        marginBottom: 18,
        marginHorizontal: 20,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    successMessage: {
        color: 'green',
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

export default RegistrationForm;
