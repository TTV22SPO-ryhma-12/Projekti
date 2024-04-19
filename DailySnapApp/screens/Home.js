import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, RefreshControl, Button } from 'react-native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { fetchImages, fetchImageData } from '../Firebase/FirebaseAuth';
import { auth, firestore } from '../Firebase/FirebaseConfig';
import { useTheme } from '../Components/ThemeContext';

export default function Home() {
    const { isDarkMode } = useTheme();

    const [images, setImages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(0);

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
                return foundImage ? { ...foundImage, caption: image.caption, username: image.username, createdAt: image.createdAt } : image;
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

    const handleDoublePress = (url, likedByCurrentUser) => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime;
        if (timeDiff < 300) {
            handleLike(url, likedByCurrentUser);
        }
        setLastClickTime(currentTime);
    };

    const formatDate = (date) => {
        const d = date.toDate();
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    return (
        <View style={[styles.home, isDarkMode ? styles.dark : styles.light]}>
            <ScrollView
                style={styles.scroll}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
                {images.slice().sort((a, b) => b.createdAt - a.createdAt).map((image, index) => (
                    <TouchableOpacity key={index} activeOpacity={1} style={styles.imageContainer} onPress={() => handleDoublePress(image.url, image.likedByCurrentUser)}>
                        <Text style={[styles.username, isDarkMode ? styles.dark : styles.light]}>{image.username}</Text>
    
                        <View style={styles.uploadTimeContainer}>
                            <Text style={styles.uploadTime}>{formatDate(image.createdAt)}</Text>
                        </View>
    
                        <Image source={{ uri: image.url}} style={styles.image} />
                        <Text style={[styles.caption, isDarkMode ? styles.dark : styles.light]}>{image.caption}</Text>
    
                        <View style={styles.likesContainer}>
                            <Text style={styles.likes}>{image.likesCount} {image.likedByCurrentUser ? '❤️' : '🤍'}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}    

const styles = StyleSheet.create({
    home: {
        flex: 1,
        paddingTop: 50,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    scroll: {
        flex: 1,
    },
    imageContainer: {
        marginBottom: 20,
        position: 'relative', // Needed for absolute positioning of likes
    },
    image: {
        width: '100%',
        aspectRatio: 1, // Maintain aspect ratio
    },
    username: {
        paddingHorizontal: 2,
        fontWeight: '800',
        fontSize: 25,
        marginBottom: 3,
    },
    caption: {
        paddingHorizontal: 2,
        fontSize: 20,
        marginBottom: 5,
        color: 'gray',
        fontStyle: 'italic',
    },
    likesContainer: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 5,
        paddingHorizontal: 5,
    },
    likes: {
        fontSize: 15,
    },
    uploadTimeContainer: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    uploadTime: {
        paddingHorizontal: 2,
        fontSize: 15,
        marginTop: 5,
        color: 'gray',
    },
    dark: {
        backgroundColor: '#333',
        color: '#fff',
    },
    light: {
        backgroundColor: '#fff',
        color: '#333',
    },
    likes: {
        fontSize: 18,
    },
});
