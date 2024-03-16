import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView, Text, View, TextInput, Button, StyleSheet } from 'react-native';

const auth = getAuth();

function RegisterationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');


    const handleSubmit = async (event) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            
            setSuccessMessage('User has been registered');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <View>
                <Text style={styles.heading}>Registeration</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
                <Button title="Register" onPress={handleSubmit} />
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
    },
    successMessage: {
        color: 'green',
    },
});


export {
    RegisterationForm
}