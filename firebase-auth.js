// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// 🔧 Replace with your real Firebase config:
const firebaseConfig = {
apiKey: "AIzaSyC-zAFlQjB0nJHpN8af89BeCFkI5z2LyLQ",
  authDomain: "smart-study-planner-31cdc.firebaseapp.com",
  projectId: "smart-study-planner-31cdc",
  storageBucket: "smart-study-planner-31cdc.firebasestorage.app",
  messagingSenderId: "897163218631",
  appId: "1:897163218631:web:5324ebb9fe6384271b78e2",
  measurementId: "G-GSTB0TJ85Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.loginWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("welcomeSection").style.display = "block";
      document.getElementById("userName").innerText = user.displayName || user.email;
    })
    .catch((error) => {
      alert("Google Login Failed: " + error.message);
    });
};

window.login = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("welcomeSection").style.display = "block";
      document.getElementById("userName").innerText = user.email.split("@")[0];
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
};

window.handleSignup = () => {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      document.getElementById("signupModal").style.display = "none";
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("welcomeSection").style.display = "block";
      document.getElementById("userName").innerText = name;
      alert("Account created successfully!");
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
};
