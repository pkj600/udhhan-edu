// auth.js - Handle user authentication with Firebase
document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector('form[action=""] button[name="login"]');
    const registerForm = document.querySelector('form[action=""] button[name="register"]');

    if (loginForm) {
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('username').value; //Using username input for email
            const password = document.getElementById('password').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    localStorage.setItem("currentUser", JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        isLoggedIn: true
                    }));
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        });
    }

    if (registerForm) {
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const password2 = document.getElementById('passwordConfirm').value;

            if (password !== password2) {
                alert("Passwords do not match");
                return;
            }

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    localStorage.setItem("currentUser", JSON.stringify({
                        uid: user.uid,
                        email: user.email,
                        isLoggedIn: true
                    }));
                    alert("Registration successful!");
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        });
    }

    // Handle navbar login/logout button if it exists
    const loginStatus = document.getElementById('login-status');
    if (loginStatus) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (currentUser && currentUser.isLoggedIn) {
            loginStatus.innerHTML = `
                <span>Welcome, ${currentUser.email}</span>
                <button id="logout-btn" class="btn btn-sm btn-outline-secondary">Logout</button>
            `;

            document.getElementById('logout-btn').addEventListener('click', function() {
                auth.signOut().then(() => {
                    localStorage.removeItem("currentUser");
                    window.location.reload();
                }).catch((error) => {
                    alert(error.message);
                });
            });
        } else {
            loginStatus.innerHTML = `
                <a href="login.html" class="btn btn-sm btn-outline-primary">Login</a>
                <a href="register.html" class="btn btn-sm btn-primary ms-2">Register</a>
            `;
        }
    }
});

function isLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser && currentUser.isLoggedIn;
}

function requireLogin() {
    if (!isLoggedIn()) {
        alert("Please login to access this page");
        window.location.href = "login.html";
        return false;
    }
    return true;
}