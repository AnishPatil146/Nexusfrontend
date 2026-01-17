import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDj8inYV01Qx2VAX2eTOFRRmL9ikm_gTvs",
    authDomain: "performancecrm-f9a7a.firebaseapp.com",
    projectId: "performancecrm-f9a7a",
    storageBucket: "performancecrm-f9a7a.appspot.com",
    messagingSenderId: "1025590305788",
    appId: "1:1025590305788:web:0f29675cab4ecb96b68879",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
