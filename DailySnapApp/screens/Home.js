import { StyleSheet, View, Text, TextInput, Button, StatusBar } from 'react-native';



export default function Home(){

    return(
        <View style={styles.home}>
            <Text>Tervetuloa kotisivulle</Text>
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