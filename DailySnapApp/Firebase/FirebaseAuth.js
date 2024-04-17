import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, deleteUser } from "firebase/auth";
import { storage, collection, addDoc, doc, setDoc, firestore, getDoc, getDocs, USERS, serverTimestamp, auth } from "./FirebaseConfig";
import { uploadBytesResumable, ref, deleteObject } from "firebase/storage";
import { listAll, getDownloadURL } from "firebase/storage";


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
        const userImageRef = ref(storage, `images/${userId}/${fileName}`);
        const allImagesRef = ref(storage, `allimages/${fileName}`);

        // Upload function handling both user-specific and general storage
        const uploadTask = uploadBytesResumable(userImageRef, theBlob);
        const uploadTaskAll = uploadBytesResumable(allImagesRef, theBlob);

        // Monitor upload progress
        uploadTask.on('state_changed', 
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
        await uploadTask;
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
        return { userImageUrl: downloadUrl };
    } catch (error) {
        console.error('Error uploading image and storing metadata:', error);
        throw error;
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
