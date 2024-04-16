import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Button } from 'react-native';
import { getFirestore, collection, doc, setDoc, updateDoc, addDoc } from 'firebase/firestore';
import { fetchImages, updateLikesInFirestore } from '../Firebase/FirebaseAuth';

const db = getFirestore();

export default function Home() {
    const [images, setImages] = useState([]);
    const [likes, setLikes] = useState({});
    
    useEffect(() => {
        const fetchImagesFromFirebase = async () => {
            try {
                const fetchedImages = await fetchImages('allimages');
                setImages(fetchedImages);
    
                // Initialize likes object with default values
                const initialLikes = fetchedImages.reduce((acc, image) => {
                    acc[image.url] = { likes: 0, liked: false };
                    return acc;
                }, {});
                setLikes(initialLikes);
            } catch (error) {
                console.error("Error fetching images:", error.message);
            }
        };
    
        fetchImagesFromFirebase();
    }, []);

    const updateLikesInFirestore = async (url, { likes, liked }) => {
        try {
            // Encode the URL to create a valid Firestore document ID
            const docId = encodeURIComponent(url);
            const imageRef = doc(db, 'images', docId);
            await setDoc(imageRef, { likes, liked }, { merge: true });
        } catch (error) {
            console.error("Error updating likes in Firestore:", error.message);
            throw error;
        }
    };

    const handleLike = async (url) => {
        try {
            const updatedLikes = { ...likes };
            if (updatedLikes[url].liked) {
                updatedLikes[url].likes--;
            } else {
                updatedLikes[url].likes++;
            }
            updatedLikes[url].liked = !updatedLikes[url].liked;
            setLikes(updatedLikes);

            // Update Firestore document with updated likes data
            await updateLikesInFirestore(url, updatedLikes[url]);
        } catch (error) {
            console.error("Error updating like:", error.message);
        }
    };

 
    return (
        <View style={styles.container}>
            <ScrollView>
                {images.map((image, index) => (
                    <View key={index}>
                        <Image source={{ uri: image.url }} style={styles.image} />
                        <Button title={likes[image.url]?.liked ? 'Unlike' : 'Like'} onPress={() => handleLike(image.url)} />
                        {likes[image.url] && (
                            <Text>Likes: {likes[image.url].likes}</Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 10,
    },
});
