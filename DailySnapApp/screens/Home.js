import { StyleSheet, View, Text, TextInput, Button, StatusBar, ScrollView, Image, TouchableOpacity, RefreshControl} from 'react-native';
import { CameraComponent } from '../Components/camera';
import { fetchImages } from '../Firebase/FirebaseAuth';
import React, { useEffect, useState } from 'react';
import { auth, fetchUsername, } from '../Firebase/FirebaseAuth';
import { getDoc, doc, firestore, USERS } from '../Firebase/FirebaseConfig';



export default function Home() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const openImage = (url) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
          console.log("Refreshing page.")
        }, 2000);
      }, []);

    useEffect(() => {
        const fetchImagesFromFirebase = async () => {
                const fetchedImages = await fetchImages();
                console.log('fetched Images', fetchedImages);
                setImages(fetchedImages);
        };
        fetchImagesFromFirebase();
    }, []);

    useEffect(() => {
        const checkUser = async () => {
            const user = auth.currentUser;
            if (user) {
                const username = await fetchUsername(user.uid);
                console.log('username', username);
        }
        }
        checkUser();
    } , []);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const fetchedUsername = await getUsername(user.uid);
                    setUsername(fetchedUsername);
                } else {
                    setUsername("NO USER");
                }
            } catch (error) {
                console.error("Error fetching username:", error.message);
            }
            setLoading(false);
        };
        fetchUsername();
    }, []);

    const getUsername = async () => {
        const userDoc = doc(firestore, USERS, auth.currentUser.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            return docSnap.data().username;
        } else {
            throw new Error("User document not found");
        }
    };

    return (
        <View style={styles.home}>
            <Text>Tervetuloa kotisivulle</Text>
            <ScrollView style={styles.scroll}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
            {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image.url }} style={styles.image} />
                    <Text style={styles.username}>{username}{image.username}</Text>
                    <Text style={styles.caption}>{image.caption}</Text>
                </View>
            ))}
            </ScrollView>
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
    scroll: {
        width: "100%",
        
    },
    image: {
        width: "100%",
        height: 400,
        marginVertical: 5,
    },
    imageContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: 'white',
    },
    caption: {
        fontSize: 16,
        color: 'gray',
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})
