import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, deleteUser } from "firebase/auth";
import { storage, collection, addDoc, doc, setDoc, firestore, getDoc, getDocs, USERS, serverTimestamp, auth } from "./FirebaseConfig";
import { uploadBytesResumable, ref, deleteObject } from "firebase/storage";
import { listAll, getDownloadURL } from "firebase/storage";
import { Platform } from "react-native";
import { deleteDoc } from "firebase/firestore";


const signUpWithEmailAndPassword = (auth, email, password) => {

    if (!validateEmail(email)) {
        throw new Error('Invalid email format');

    }


    email = email.trim();


    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            const user = userCredential.user;
            return user;
        })
        .catch((error) => {

            throw error;
        });
};

const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);

};


const fetchImages = async (path) => {

    const storageRef = ref(storage, path);
    try {
        const result = await listAll(storageRef);
        const urls = await Promise.all(result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { url }; // Wrap the URL in an object with 'url' property
        }));
        return urls;
    } catch (error) {

        console.error("Error fetching images:", error.message);

        throw error;
    }
};

const fetchImagesForCurrentUser = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user signed in');
    }

    try {
        const username = await getUsername(user.uid);
        const imagesRef = collection(firestore, 'images');
        const querySnapshot = await getDocs(imagesRef.where('username', '==', username));
        const imageData = querySnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            return {
                url: data.imageUrl,
                caption: data.caption,
                createdAt: data.createdAt.toDate(),
            };
        });
        return imageData;
    } catch (error) {
        console.error("Error fetching images for current user:", error.message);
        throw error;
    }
};




const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            const user = userCredential.user;
            return user;
        })
        .catch((error) => {

            throw error;
        });
};


const onAuthStateChange = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};


/** 
 * 
 * @param {*} uri
*/


const uploadToFirebase = async (uri, userId, caption, onProgress) => {
    try {
        console.log("Received userid", userId);
        const fetchResponse = await fetch(uri);
        const theBlob = await fetchResponse.blob();
        const fileName = uri.split('/').pop();


        // References for storing the image in Firebase Storage
        const allImagesRef = ref(storage, `allimages/${fileName}`);

        // Upload function handling both user-specific and general storage
        const uploadTaskAll = uploadBytesResumable(allImagesRef, theBlob);

        // Monitor upload progress
        uploadTaskAll.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                onProgress(progress);
            },
            (error) => {
                console.error('Error uploading image:', error);
            }
        );


        // Perform uploads to both directories
        await uploadTaskAll;

        const downloadUrl = await getDownloadURL(allImagesRef);


        const imageUrl = encodeURIComponent(downloadUrl);

        // Save the image data to Firestore under images collection
        const imageRef = doc(firestore, 'images', imageUrl);
        await setDoc(imageRef, {
            userId: userId,
            imageUrl: downloadUrl,  // You could also use allImageUrl here if preferred
            caption: caption,
            createdAt: serverTimestamp(),
            likes: 0  // Initialize likes count
        });

        console.log('Image uploaded and metadata stored successfully');
        return { allImageUrl: downloadUrl };
    } catch (error) {
        console.error('Error uploading image and storing metadata:', error);
        throw error;
    }
};

const uploadProfilePicture = async (uri, userId, onProgress) => {
    console.log(`Uploading image from URI: ${uri}`);
    if (!uri) {
        console.error('No image URI provided');
        throw new Error('No image URI provided');
    }
    const userImageRefPath = `profilePictures/${userId}`;
    const userImageRef = ref(storage, userImageRefPath);

    try {
        const existingPicSnap = await listAll(userImageRef);
        existingPicSnap.items.forEach(async item => {
            await deleteObject(item);
        });
    } catch (error) {
        console.error('Error deleting existing profile picture:', error);
    }

    try {
        const fileName = uri.split('/').pop();
        const newUserImageReff = ref(storage, `profilePictures/${userId}/${fileName}`);
        const response = await fetch(uri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(newUserImageReff, blob);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                if (onProgress) {
                    onProgress(progress);
                }
            },
            (error) => {
                console.error('Error uploading image:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    updateUserProfileImage(userId, downloadURL);
                });
            });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
};

const updateUserProfileImage = async (userId, imageUrl) => {
    const userRef = doc(firestore, 'users', userId);
    try {
        await setDoc(userRef, { profilePicture: imageUrl }, { merge: true });
        console.log('Profile picture updated successfully');
    } catch (error) {
        console.error('Error updating profile picture:', error);
    }
}

const fetchProfileImage = async (userId) => {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists() && userSnap.data().profilePicture) {
        console.log("proffiilikuva firestoresta linkilä:", userSnap.data().profilePicture);
        return userSnap.data().profilePicture;
    } else {
        console.error('User document not found');
        return null;
    }
};



const fetchUsername = async (userId) => {
    const userRef = doc(firestore, 'users', userId);
    const userSnap = await getDoc(userRef);
    console.log(userSnap);
    if (userSnap.exists()) {
        return userSnap.data().username;
    } else {
        console.log("User document not found");
        return "Unknown";
    }
}


const fetchImageData = async () => {
    const imagesRef = collection(firestore, 'images');
    const querySnapshot = await getDocs(imagesRef);
    const imageData = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
        const data = docSnapshot.data();
        console.log("Image data:", data);

        if (!data.userId) {
            console.error("Missing userId for image:", data);
            return {
                url: data.imageUrl,
                username: 'Unknown user',  // Fallback if userId is missing
                caption: data.caption
            };
        }

        // Fetch the actual username using the userId stored in the username field of image document
        const userDoc = doc(firestore, 'users', data.userId);
        const userSnap = await getDoc(userDoc);
        const username = userSnap.exists() ? userSnap.data().username : "Unknown user"; // Fallback if user not found
        return {
            url: data.imageUrl,
            username: username,
            caption: data.caption,
            createdAt: data.createdAt,
        };
    }));
    return imageData;
};


const getUsername = async () => {
    const userDoc = doc(firestore, USERS, auth.currentUser.uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
        console.log(docSnap)
        return docSnap.data().username;
        
    } else {
        throw new Error("User document not found");
    }
};


const deleteCurrentUser = async () => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error('No user signed in');
    }

    const userDocRef = doc(firestore, USERS, user.uid);

    try {
        const docSnap = await getDoc(userDocRef);
        
        if (!docSnap.exists()) {
            throw new Error('User document not found');
        }

        await deleteUser(user);
        console.log('User deleted successfully from Auth');

        await deleteDoc(userDocRef);
        console.log('User document deleted successfully from Firestore');
        
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};


const deleteUserStorageData = async (userId) => {
    const userFolderRef = ref(storage, `images/${userId}`);
    const { items } = await listAll(userFolderRef);
    items.forEach((itemRef) => {
        deleteObject(itemRef)
    }
    )
}

const deleteimageData = async (imageUrl) => {
    // Firestore uses the encoded URL as the document ID
    const encodedDocId = encodeURIComponent(imageUrl);
    const imageRef = doc(firestore, 'images', encodedDocId);
    console.log(imageRef)

    try {
        await deleteDoc(imageRef);
        console.log("Firestore image data deleted successfully");
    } catch (error) {
        console.error("Error deleting Firestore image data:", error);
        throw error;
    }
};

const deleteImage = async (imageUrl, documentId) => {
    try {
        // 1. Delete the image from Firebase Storage
        const imageRef = ref(storage, imageUrl);
        
        await deleteObject(imageRef);
        console.log("Image deleted from Firebase Storage successfully");
        await deleteimageData(imageUrl)
        
    } catch (error) {
        console.error("Error deleting image:", error.message);
        throw error;
    }
};

export {
    signUpWithEmailAndPassword,
    signIn,
    onAuthStateChange,
    uploadToFirebase,
    fetchImages,
    fetchImagesForCurrentUser,
    deleteCurrentUser,
    deleteUserStorageData,
    deleteImage,
    fetchUsername,
    fetchImageData,
    getUsername,
    uploadProfilePicture,
    fetchProfileImage
};
