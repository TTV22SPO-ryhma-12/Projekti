import { StyleSheet, View, Text, TextInput, Button, StatusBar } from 'react-native';
import { CameraComponent } from '../Components/camera';



export default function Home() {

    return (
        <View style={styles.home}>
            <Text>Tervetuloa kotisivulle</Text>
            <CameraComponent />
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