import { StyleSheet, View, TextInput, Button } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, messages } from './Firebase/FirebaseConfig';
import { useState } from 'react';

export default function App() {

  const [newmessage, setnewmessage] = useState('')

  const save = async () => {
    await addDoc(collection(firestore, messages), {
      text: newmessage,
      timestamp: serverTimestamp()
    })
    setnewmessage('')
    console.log('message saved')
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder='Kirjoita viesti...' value={newmessage} onChangeText={text => setnewmessage(text)} />
      <Button title='Lähetä viesti' type="button" onPress={save} />
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
});
