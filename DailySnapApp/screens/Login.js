import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView, Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { firestore, collection, addDoc, doc, setDoc, getDoc, ref, USERS } from '../Firebase/FirebaseConfig';
import { useTheme } from '../Components/ThemeContext';


const auth = getAuth();

export default function LoginForm({ navigation }) {
    const { isDarkMode } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            setSuccessMessage('Login successful');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
        console.log("registration screen opened")
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, isDarkMode ? styles.dark : styles.light]}>
            <View>
                <Text style={styles.heading}>Login</Text>
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
                    title={loading ? "Logging in..." : "Login"}
                    onPress={handleSubmit}
                    disabled={loading}
                    accessibilityLabel="Login Button"
                />
                <Button
                    title="Register"
                    onPress={handleRegister}
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
        marginHorizontal: 25,
    },
    heading: {
        fontSize: 25,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 42,
        borderColor: 'black',
        borderWidth: 2,
        marginBottom: 15,
        backgroundColor: 'white',
        padding: 5,
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
