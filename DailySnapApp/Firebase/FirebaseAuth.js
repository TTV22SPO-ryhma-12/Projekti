import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, deleteUser } from "firebase/auth";
import { doc, firestore, serverTimestamp, storage, setDoc, getDoc, collection, getDocs, query, where } from "./FirebaseConfig";
import { uploadBytesResumable, ref, deleteObject } from "firebase/storage";
import { listAll, getDownloadURL,  } from "firebase/storage";


const auth = getAuth();


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

const fetchImages = async (userId = null) => {
    let storageRef;

    storageRef = userId ? ref(storage, `images/${userId}`) : ref(storage, 'allimages')

    try {
        const result = await listAll(storageRef);
        const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef));
        const urls = await Promise.all(urlPromises);
        return urls.map(url => ({ url }));
    } catch (error) {
        console.error("Error fetching images:", error);
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
                        });
    
                        resolve(downloadURL);
                    }
                );
            });
    }

    try {
        const [userImageUrl, allImageUrl] = await Promise.all([
            uploadImage(userImageRef),
            uploadImage(allImagesRef)
        ]);
        return { userImageUrl, allImageUrl };
    } catch (error) {
        console.error("Error uploading image:", error.message);
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



const deleteCurrentUser = async () => {
    const user = auth.currentUser

    if (!user) {
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
    const { items } = await listAll(userFolderRef);
    items.forEach((itemRef) => {
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
};
