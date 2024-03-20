import React from "react";
import react, { TouchableOpacity, View } from 'react-native'
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function Profilepage(){

    const handleSignOut = async () => {
        await auth.signOut();
    }

    const Modal = () => {
        Alert.alert("Auth App", "Do you really want to logout", [
            {
                text: "Cancel",
                onpress: () => console.log("Cancel pressed"),
            },
            { text: "Logout", onPress: handleSignout },
        ])
    }

    return(
        <View style={styles.container}>

      
        <View>
            <Text style={styles.navText}>Tervetuloa profiiliisi</Text>
       

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={{color: Colors.white, fontSize: 20 }}>Sign out</Text>
        </TouchableOpacity>
        </View>
    </View>

    )
}

