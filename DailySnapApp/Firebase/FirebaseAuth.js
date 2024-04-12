import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, deleteUser } from "firebase/auth";
import { storage } from "./FirebaseConfig";
import { uploadBytesResumable, ref, deleteObject } from "firebase/storage";
import { listAll, getDownloadURL } from "firebase/storage";


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

const fetchImages = async (path) => {
    const storageRef = ref(storage, path);
    try {
        const result = await listAll(storageRef);
        const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
        const urls = await Promise.all(urlPromises);
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

    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    const fileName = uri.split('/').pop();
    console.log(theBlob)

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
            },
            (error) => {
                reject(error);
            },
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                    downloadUrl,
                    metadata: uploadTask.snapshot.metadata
                });
            }
        )
    })

}
const userImageUrl = await uploadImage(userImageRef);
const allImageUrl = await uploadImage(allImagesRef);
return { userImageUrl, allImageUrl };
}

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
