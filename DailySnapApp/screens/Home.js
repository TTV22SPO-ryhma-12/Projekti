import React, { useEffect, useState } from 'react';
import { auth, fetchUsername, fetchImageData } from '../Firebase/FirebaseAuth';
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
          user = auth.currentUser
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
        <View style={styles.home}>
            <Text>Tervetuloa kotisivulle</Text>
            <ScrollView style={styles.scroll}>
            {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri: image.url}} style={styles.image} />
                    <Button title={image.likedByCurrentUser ? 'Unlike' : 'Like'} onPress={() => handleLike(image.url, image.likedByCurrentUser)} />
                    <Text>Likes: {image.likesCount}</Text>
                    <TouchableOpacity onPress={() => openImage(image.url)}>
                        <Text>Open Image</Text>
                    </TouchableOpacity>
                    <Text style={styles.username}>{image.username}</Text>
                    <Text style={styles.caption}>{image.caption}</Text>
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
