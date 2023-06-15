import { initializeApp } from 'firebase/app'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJt5VOLsKlBA52yysiga0EN4Ef5AvwqvM",
  authDomain: "viewpoint-fb1e1.firebaseapp.com",
  projectId: "viewpoint-fb1e1",
  storageBucket: "viewpoint-fb1e1.appspot.com",
  messagingSenderId: "748993256346",
  appId: "1:748993256346:web:ea29e15ed3630394ddb823"
}

const app = initializeApp(firebaseConfig)
export default app
