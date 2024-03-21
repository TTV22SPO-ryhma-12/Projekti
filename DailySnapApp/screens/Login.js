import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView, Text, View, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { RegistrationForm } from './Registeration';

// Initialize Firebase authentication
const auth = getAuth();

function LoginForm({ onSignInSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showRegister, setShowRegister] = useState(false); // Add a state to manage whether to show the registration form

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            setSuccessMessage('Login successful');
            console.log('login successful')
            console.log(auth.currentUser.uid)
            
            onSignInSuccess()
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle opening the registration form
    const handleRegister = () => {
        setShowRegister(true);
    };

    // Render the LoginForm or RegisterForm based on the showRegister state
    if (showRegister) {
        return <RegistrationForm/>;
    }

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
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
                    onPress={handleRegister} // Attach the handleRegister function to the onPress event of the Register button
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
        marginHorizontal: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 20,
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    successMessage: {
        color: 'green',
        textAlign: 'center',
    },
});

export { LoginForm };
