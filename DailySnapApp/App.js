import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Avaa sovellus lol!</Text>
      <TouchableOpacity>
        <Text style={styles.kamera} >Avaa kamera</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kamera: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 5,
    color: 'white',
    marginTop: 20,
  },
});
