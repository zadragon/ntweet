import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBL0FSxm6hKVtxhj_0jxIs5jT8QiyxhYck",
  authDomain: "nwitter-92e67.firebaseapp.com",
  projectId: "nwitter-92e67",
  storageBucket: "nwitter-92e67.appspot.com",
  messagingSenderId: "412501513645",
  appId: "1:412501513645:web:704ba80669c39acc9dfd24",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
