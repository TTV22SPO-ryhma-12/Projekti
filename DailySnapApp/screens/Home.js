import React, { useEffect, useState } from 'react';
import { fetchUsername, fetchImageData } from '../Firebase/FirebaseAuth';
import { StyleSheet, View, Text, ScrollView, Image, Button, RefreshControl } from 'react-native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { fetchImages } from '../Firebase/FirebaseAuth';
import { auth, firestore } from '../Firebase/FirebaseConfig';

export default function Home() {
    const [images, setImages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchImageDataFromFirebase();
    }, []);

    const fetchImageDataFromFirebase = async () => {
        try {
            // Fetch image data first
            const imageData = await fetchImageData();
    
            // Now fetch images with likes data
            const user = auth.currentUser.uid;
            const fetchedImages = await fetchImages('allimages');
            const imagesWithLikes = await Promise.all(fetchedImages.map(async (image) => {
                const docId = encodeURIComponent(image.url);
                const likesRef = doc(firestore, 'likes', docId);
                const docSnapshot = await getDoc(likesRef);
                const likesData = docSnapshot.exists() ? docSnapshot.data() : { likes: {}, likesCount: 0 };
                const likedByCurrentUser = likesData.likes && likesData.likes[user] ? true : false;
                return { ...image, likesCount: likesData.likesCount, likedByCurrentUser };
            }));
    
            // Merge image data with likes data
            const mergedImages = imageData.map(image => {
                const foundImage = imagesWithLikes.find(img => img.url === image.url);
                return foundImage ? { ...foundImage, caption: image.caption, username: image.username } : image;
            });
    
            // Update state with merged data
            setImages(mergedImages);
        } catch (error) {
            console.error("Error fetching images:", error.message);
        }
    };
    
    
    const handleRefresh = () => {
        setRefreshing(true);
        fetchImageDataFromFirebase().then(() => {
            setRefreshing(false);
        });
    };

    const handleLike = async (url, likedByCurrentUser) => {
        try {
            const userId = auth.currentUser.uid;
            const liked = !likedByCurrentUser;
            const docId = encodeURIComponent(url);
            const likesRef = doc(firestore, 'likes', docId);
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
        <View style={styles.home}>
            <Text>Tervetuloa kotisivulle</Text>
            <ScrollView
                style={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
                {images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Text style={styles.username}>{image.username}</Text>
                        <Image source={{ uri: image.url}} style={styles.image} />
                        <Text style={styles.caption}>{image.caption}</Text>
                        <Button title={image.likedByCurrentUser ? 'Unlike' : 'Like'} onPress={() => handleLike(image.url, image.likedByCurrentUser)} />
                        <Text>Likes: {image.likesCount}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    scroll: {
        flex: 1,
        width: '100%',
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 10,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    caption: {
        fontStyle: 'italic',
        fontSize: 16,
    },
});
