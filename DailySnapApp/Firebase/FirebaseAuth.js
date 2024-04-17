import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, deleteUser } from "firebase/auth";
import { storage } from "./FirebaseConfig";
import { uploadBytesResumable, ref, deleteObject } from "firebase/storage";
import { listAll, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
const auth = getAuth();
const db = getFirestore();

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


const fetchImages = async (userId) => {

    console.log("fetching images for user", userId)
    const path = userId ? `images/${userId}` : 'allimages';
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

const uploadToFirebase = async (uri, userId) => {
    try {
        // Fetch image data and create a blob
        const fetchResponse = await fetch(uri);
        const theBlob = await fetchResponse.blob();
        const fileName = uri.split('/').pop();

        // Reference for storing the image in Firebase Storage
        const userImageRef = ref(storage, `images/${userId}/${fileName}`);
        const allImagesRef = ref(storage, `allimages/${fileName}`);
        
        // Upload the image to Firebase Storage
        const uploadTask = uploadBytesResumable(userImageRef, theBlob);
        const uploadTaskAll = uploadBytesResumable(allImagesRef, theBlob);
        
        // Monitor upload progress
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error('Error uploading image:', error);
            }
        );

        // Wait for the upload to complete
        await uploadTask;
        await uploadTaskAll;

        // Get the download URL of the uploaded image
        const downloadUrl = await getDownloadURL(allImagesRef);

        // Encode the download URL to create a valid Firestore document ID
        const docId = encodeURIComponent(downloadUrl);

        // Store image metadata in Firestore
        const imageRef = doc(db, 'images', docId);
        await setDoc(imageRef, {
            userId: userId,
            docId: downloadUrl,
            likes: 0, // Initialize likes count to 0
        });


const uploadToFirebase = async (uri, userId, caption, onProgress) => {
    console.log("received userid", userId)
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    const fileName = `${userId}_${Date.now()}`;

    const userImageRef = ref(storage, `images/${userId}/${fileName}`);
    const allImagesRef = ref(storage, `allimages/${fileName}`);

    const uploadImage = async (storageRef) => {
        const uploadTask = uploadBytesResumable(storageRef, theBlob);
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    onProgress(progress);
                },
                reject,
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);
                    // Save the image data to Firestore under images collection
                    await setDoc(doc(firestore, 'images', fileName), {
                        caption,
                        imageUrl: downloadURL,
                        createdAt: serverTimestamp(),
                        username: userId
                    });

                    resolve(downloadURL);
                }
            );
        });
    }

        return { userImageUrl: downloadUrl };
    } catch (error) {
        console.error('Error uploading image and storing metadata:', error);
        throw error;
    }

}


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

        if (!data.username) {
            console.error("Missing userId for image:", data);
            return {
                url: data.imageUrl,
                username: 'Unknown user',  // Fallback if userId is missing
                caption: data.caption
            };
        }

        // Fetch the actual username using the userId stored in the username field of image document
        const userDoc = doc(firestore, 'users', data.username);
        const userSnap = await getDoc(userDoc);
        const username = userSnap.exists() ? userSnap.data().username : "Unknown user"; // Fallback if user not found
        return {
            url: data.imageUrl,
            username: username,
            caption: data.caption
        };
    }));
    return imageData;
};


const getUsername = async () => {
    const userDoc = doc(firestore, USERS, auth.currentUser.uid);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
        return docSnap.data().username;
    } else {
        throw new Error("User document not found");
    }
};


const deleteCurrentUser = async () => {
    const user = auth.currentUser

    if(!user) {
        throw new Error('No user signed in')
    }

    try {
        await deleteUser(user)
        console.log('User deleted successfully')
    } catch (error) {
        console.error('Error deleting user:', error)
        throw error
    }   
}

const deleteUserStorageData = async (userId) => {
    const userFolderRef = ref(storage, `images/${userId}`);
    const { items }= await listAll(userFolderRef);
    items.forEach((itemRef)=> {
        deleteObject(itemRef)
    }
    )
}

const deleteImage = async (imageUrl) => {
    try {
        
        const imageRef = ref(storage, imageUrl);

       
        await deleteObject(imageRef);

        console.log("Image deleted successfully");
    } catch (error) {
        console.error("Error deleting image:", error.message);
        throw error;
    }
}

export {
    auth,
    signUpWithEmailAndPassword,
    signIn,
    onAuthStateChange,
    uploadToFirebase,
    fetchImages,
    deleteCurrentUser,
    deleteUserStorageData,
    deleteImage,
    fetchUsername,
    fetchImageData,
    getUsername
};
