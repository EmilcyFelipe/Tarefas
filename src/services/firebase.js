import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAGZ7U2HyqSiF-HQJwpRI0q_nFuVzGn8Uc",
  authDomain: "tarefas-51969.firebaseapp.com",
  projectId: "tarefas-51969",
  storageBucket: "tarefas-51969.appspot.com",
  messagingSenderId: "539468811127",
  appId: "1:539468811127:web:af6ceb36142590a07f6f72"
};

const app = initializeApp(firebaseConfig);

export default app;