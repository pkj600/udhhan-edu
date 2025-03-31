<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAKYS65vYt5caZaVdgkRXQ3WUeR7ZqDzp8",
    authDomain: "udhhan-edu.firebaseapp.com",
    databaseURL: "https://udhhan-edu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "udhhan-edu",
    storageBucket: "udhhan-edu.firebasestorage.app",
    messagingSenderId: "40194107605",
    appId: "1:40194107605:web:7e3db7787b3dd0cf785a5c",
    measurementId: "G-6YDCHWPVKE"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>