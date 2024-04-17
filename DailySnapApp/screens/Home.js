import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Button } from 'react-native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { fetchImages } from '../Firebase/FirebaseAuth';
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const db = getFirestore();

export default function Home() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImagesFromFirebase = async () => {
            try {
                const fetchedImages = await fetchImages('allimages');
                const imagesWithLikes = await Promise.all(fetchedImages.map(async (image) => {
                    const docId = encodeURIComponent(image.url);
                    const likesRef = doc(db, 'likes', docId);
                    const docSnapshot = await getDoc(likesRef);
                    const likesData = docSnapshot.exists() ? docSnapshot.data() : { likes: {}, likesCount: 0 };
                    const likedByCurrentUser = likesData.likes && likesData.likes[auth.currentUser.uid] ? true : false;
                    return { ...image, likesCount: likesData.likesCount, likedByCurrentUser };
                }));
                setImages(imagesWithLikes);
            } catch (error) {
                console.error("Error fetching images:", error.message);
            }
        };

        fetchImagesFromFirebase();
    }, []);

    const handleLike = async (url, likedByCurrentUser) => {
        try {
            const userId = auth.currentUser.uid; // Get the ID of the currently authenticated user
            const liked = !likedByCurrentUser; // Toggle like for the current user
            const docId = encodeURIComponent(url);
            const likesRef = doc(db, 'likes', docId);
            const docSnapshot = await getDoc(likesRef);
            const likesData = docSnapshot.exists() ? docSnapshot.data() : { likes: {}, likesCount: 0 };
            const currentLikes = likesData.likes || {};
            currentLikes[userId] = liked;
            const likesCount = Object.values(currentLikes).filter(like => like).length;
            await setDoc(likesRef, {
                likes: currentLikes,
                likesCount
            });
            setImages(prevImages => {
                return prevImages.map(image => {
                    if (image.url === url) {
                        return { ...image, likesCount, likedByCurrentUser: liked };
                    }
                    return image;
                });
            });
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
                        <Button title={image.likedByCurrentUser ? 'Unlike' : 'Like'} onPress={() => handleLike(image.url, image.likedByCurrentUser)} />
                        <Text>Likes: {image.likesCount}</Text>
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
