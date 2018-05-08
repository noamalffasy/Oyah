import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyD3vyx6XFFztE0qlh9gljA83BWK7rAY0Tk",
  authDomain: "oyah-200816.firebaseapp.com",
  databaseURL: "https://oyah-200816.firebaseio.com",
  projectId: "oyah-200816",
  storageBucket: "oyah-200816.appspot.com",
  messagingSenderId: "394175612865"
};

export const app = !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();

export default firebase;
