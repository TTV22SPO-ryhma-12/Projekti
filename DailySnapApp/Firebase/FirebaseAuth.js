import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, deleteUser } from "firebase/auth";
import { storage } from "./FirebaseConfig";
import { uploadBytesResumable, ref, deleteObject } from "firebase/storage";
import { listAll, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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
        console.error('Error fetching images:', error);
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
        const downloadUrl = await getDownloadURL(userImageRef);

        // Store image metadata in Firestore
        const imageRef = collection(db, 'images'); // Change to 'images' collection
        await addDoc(imageRef, {
            userId: userId,
            imageURL: downloadUrl,
            likes: 0, // Initialize likes count to 0
            liked: false // Initialize liked status to false
        });

        console.log('Image uploaded and metadata stored successfully');

        return { userImageUrl: downloadUrl };
    } catch (error) {
        console.error('Error uploading image and storing metadata:', error);
        throw error;
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
};
