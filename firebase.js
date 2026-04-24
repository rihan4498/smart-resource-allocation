import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdF6AY10l0fNNO2NZ1pSVQJYWyVZWIdwA",
  authDomain: "smart-resource-allocatio-8a474.firebaseapp.com",
  projectId: "smart-resource-allocatio-8a474",
  storageBucket: "smart-resource-allocatio-8a474.appspot.com",
  messagingSenderId: "852101194951",
  appId: "1:852101194951:web:9428d96ffd882513ffcae2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);