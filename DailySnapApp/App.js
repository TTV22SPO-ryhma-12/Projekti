import { StyleSheet, View, TextInput, Button } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, messages, getAuth } from './Firebase/FirebaseConfig';
import { useState } from 'react';
import { RegisterationForm } from './Components/Registeration';
import { getFirestore } from 'firebase/firestore';

export default function App() {

getFirestore();

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
      <RegisterationForm />
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
