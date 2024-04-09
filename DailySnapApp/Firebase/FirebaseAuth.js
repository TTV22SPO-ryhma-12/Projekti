import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { storage } from "./FirebaseConfig";
import { uploadBytesResumable, ref } from "firebase/storage";
import { listAll, getDownloadURL } from "firebase/storage";

// Initialize Firebase authentication
const auth = getAuth();

// Function to create a new user account with email and password
const signUpWithEmailAndPassword = (auth, email, password) => {
  // Validate email format
  if (!validateEmail(email)) {
      throw new Error('Invalid email format');
      
  }

  // Trim leading and trailing whitespace
  email = email.trim();

  // Proceed with sign-up
  return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // User signed up successfully
          const user = userCredential.user;
          return user; // Return the user object
      })
      .catch((error) => {
          // Handle sign-up errors
          throw error; // Re-throw the error for handling in the UI
      });
};

const validateEmail = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  
};

const fetchImages = async (path) => {
    const storageRef = ref(storage, path);
    try {
        const result = await listAll(storageRef);
        console.log("list",result.items);
        const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
        const urls = await Promise.all(urlPromises);
        console.log(urls);
        return urls;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};


// Function to sign in with email and password
const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User signed in successfully
            const user = userCredential.user;
            return user; // Return the user object
        })
        .catch((error) => {
            // Handle sign-in errors
            throw error; // Re-throw the error for handling in the UI
        });
};

// Listen for changes in authentication state
const onAuthStateChange = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user); // Pass the user object to the callback function
    });
};


/** 
 * 
 * @param {*} uri
 * @param {*} name
*/

const uploadToFirebase = async (uri, name) => {

    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();
    console.log(theBlob)

    const storageRef = ref(storage, `images/${name}`);
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
                    metadata : uploadTask.snapshot.metadata
                });
            }
        )
    })
    
}


export {
    auth,
    signUpWithEmailAndPassword,
    signIn,
    onAuthStateChange,
    uploadToFirebase,
    fetchImages
};
