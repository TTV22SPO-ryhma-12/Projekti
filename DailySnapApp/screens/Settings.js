import { StyleSheet, View, Text, TextInput, Button, StatusBar } from 'react-native';



export default function Settings() {

    return (
        <View style={styles.home}>
            <Text>Tervetuloa asetuksiin</Text>
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