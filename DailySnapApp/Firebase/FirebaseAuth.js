import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

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

export {
    auth,
    signUpWithEmailAndPassword,
    signIn,
    onAuthStateChange
};
