import React, { useState } from 'react';
import { getAuth } from "firebase/auth";
import { SafeAreaView, Text, View, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { signUpWithEmailAndPassword } from '../Firebase/FirebaseAuth';
import { useTheme } from '../Components/ThemeContext';

const auth = getAuth();

function RegistrationForm() {
    const { isDarkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await signUpWithEmailAndPassword(auth, email, password);
            setSuccessMessage('User has been registered');
            console.log('rekisteröinti onnistui')

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#FFF'}]}>
            <View>
                <Text style={[styles.heading, { color: isDarkMode ? '#FFF' : '#000'}]}>Registration</Text>
                <TextInput
                    style={[styles.input , { color: isDarkMode ? '#FFF' : '#000'}]}
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                    accessibilityLabel="Email Input"
                />
                <TextInput
                    style={[styles.input, { color: isDarkMode ? '#FFF' : '#000'}]}
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
        marginHorizontal: 20,
        
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

export default RegistrationForm;
