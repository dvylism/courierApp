import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDhwYDWJAbEU5I8F_hEXy6Idij_EPFNRvg",
  authDomain: "company-x-2623f.firebaseapp.com",
  projectId: "company-x-2623f",
  storageBucket: "company-x-2623f.appspot.com",
  messagingSenderId: "596809724412",
  appId: "1:596809724412:web:2213db7bec5c8740dc8279",
  measurementId: "G-L9E3LBYGBC"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
