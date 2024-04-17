import { StyleSheet, View, Text, TextInput, Button, StatusBar, ScrollView, Image, TouchableOpacity} from 'react-native';
import { CameraComponent } from '../Components/camera';
import { fetchImages } from '../Firebase/FirebaseAuth';
import React, { useEffect, useState } from 'react';
import { auth, fetchUsername, fetchImageData } from '../Firebase/FirebaseAuth';



export default function Home() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    const openImage = (url) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    useEffect(() => {
        const fetchImagesFromFirebase = async () => {
            user = auth.currentUser;
            if (user) {
                const fetchedImages = await fetchImages();
                console.log('fetched Images', fetchedImages);
                setImages(fetchedImages);
            } else {
                console.log('No user signed in');
            }
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
        console.log("Final images data:", images);
    }, [images]);

    useEffect(() => {
        fetchImageData().then(images => {
            setImages(images);
            console.log('Images with details:', images);
        }).catch(error => {
            console.error('Erroriii', error);
        });
    }, []);


    return (
        <View style={styles.home}>
            <Text>Tervetuloa kotisivulle</Text>
            <ScrollView style={styles.scroll}>
            {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image.url}} style={styles.image} />
                    <TouchableOpacity onPress={() => openImage(image.url)}>
                        <Text>Open Image</Text>
                    </TouchableOpacity>
                    <Text style={styles.username}>{image.username}</Text>
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
