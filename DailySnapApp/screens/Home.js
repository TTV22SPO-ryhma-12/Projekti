import { StyleSheet, View, Text, TextInput, Button, StatusBar } from 'react-native';
import { CameraComponent } from '../Components/camera';
import { useTheme } from '../Components/ThemeContext';



export default function Home() {
    const { isDarkMode } = useTheme();

    return (
        <View style={[styles.home, { backgroundColor: isDarkMode ? '#333' : '#FFF'}]}>
            <Text style={{ color: isDarkMode ? '#FFF' : '#000' }}>Tervetuloa kotisivulle</Text>
            <CameraComponent />
        </View>
    )
}


const styles = StyleSheet.create({
    home: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
})