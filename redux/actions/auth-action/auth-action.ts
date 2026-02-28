// Auth action functions are defined here...!

import { collection, addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  LOGIN_USER,
  LOG_OUT_USER,
} from "@/redux/reducers/auth-reducer/auth-reducer";
import { setCookie, deleteCookie } from "cookies-next";

interface UserData {
  name?: string;
  email: string;
  password: string;
}

// Note: Sign up user...!
const signUpUser = (userData: UserData) => {
  return async () => {
    console.log("User: ", userData);

    try {
      const createUser = await createUserWithEmailAndPassword(
        auth,
        userData?.email,
        userData?.password,
      );
      console.log(createUser);

      const saveUserData = {
        ...userData,
        uid: createUser?.user?.uid,
      };

      if (createUser) {
        // Note: Saving data in DB...!
        const firebaseDocRef = await addDoc(
          collection(db, "Users"),
          saveUserData,
        );
        console.log("Saved data in DB: ", firebaseDocRef);
      }
    } catch (error: any) {
      console.log("Something wnet wrong while creating user: ", error.message);
    }
  };
};

// Note: Log in user...!
const logInUser = (userData: UserData) => {
  return async (dispatch: any) => {
    console.log("User: ", userData);

    try {
      const res = await signInWithEmailAndPassword(
        auth,
        userData?.email,
        userData?.password,
      );
      console.log("Login response: ", res);

      const saveUser = {
        email: res?.user?.email,
        uid: res?.user?.uid,
      };

      const userToken = await res?.user?.getIdToken();
      if (userToken) {
        // Saving token...!
        setCookie("token", userToken);

        // Saving auth user in redux...!
        dispatch(LOGIN_USER(saveUser));

        window.location.reload();
      }
    } catch (error: any) {
      console.log("Something went wrong while login user: ", error.message);
    }
  };
};

// Note: Log out user...!
const logOutUser = () => {
  return async (dispatch: any) => {
    // Removing user auth from FB authentication...!
    await signOut(auth);

    // Removing user from redux...!
  dispatch(LOG_OUT_USER(null as any));

    // Removing user cookies...!
    deleteCookie("token");

    alert("You have logged out successfully");
    window.location.reload();
  };
};

export { signUpUser, logInUser, logOutUser };
