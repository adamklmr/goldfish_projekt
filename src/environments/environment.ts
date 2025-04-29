import { initializeApp } from "firebase/app";
import { getAnalytics, initializeAnalytics } from "firebase/analytics";
export const environment = {
    production: false,
    firebaseConfig: {
        apiKey: "AIzaSyCmLjWw9u6V6YIQ9iidFMzyDUVUjRETxRI",
        authDomain: "goldfish-6624c.firebaseapp.com",
        projectId: "goldfish-6624c",
        storageBucket: "goldfish-6624c.firebasestorage.app",
        messagingSenderId: "168655505860",
        appId: "1:168655505860:web:6d595d537ccd82f4c97c91",
        measurementId: "G-0P55G2SPQ8"
    }
};
const app = initializeApp(environment.firebaseConfig);
initializeAnalytics(app);