// =========================================================================
// 1. Dark Mode Toggle
// =========================================================================
function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

// =========================================================================
// 2. DOM Event Listeners (Runs only after HTML is fully loaded)
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById("toggle");
    const password = document.getElementById("password");
    const createBtn = document.getElementById("createBtn");
    const loginForm = document.getElementById('loginForm');

    // ---------------------------------------------------------------------
    // A. Hide/Show Password Visibility Toggle
    // ---------------------------------------------------------------------
    if (toggle && password) {
        toggle.addEventListener("click", () => {
            if (password.type === "password") {
                password.type = "text";
                toggle.classList.remove("fa-eye-slash");
                toggle.classList.add("fa-eye");
            } else {
                password.type = "password";
                toggle.classList.remove("fa-eye");
                toggle.classList.add("fa-eye-slash");
            }
        });
    }

    // ---------------------------------------------------------------------
    // B. Create Vault Submission Logic (Registration)
    // ---------------------------------------------------------------------
    if (createBtn) {
        createBtn.addEventListener("click", async (e) => {
            e.preventDefault(); // Stop any default form submissions or reloads

            const passwordValue = password.value.trim();

            // Client-side validation: prevent empty submissions
            if (passwordValue === "") {
                alert("Please enter a password.");
                return;
            }

            try {
                // Sends data to your registration endpoint on the Node.js backend
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name: "Vault User",
                        email: "user@midnightvault.local", // Default placeholder since your HTML lacks an email field
                        password: passwordValue 
                    })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    // Save the authentication token in browser memory
                    localStorage.setItem('userToken', data.token);
                    
                    alert("Vault Created Successfully!");
                    
                    // Redirect browser to the main dashboard interface
                    window.location.href = 'dashboard.html'; 
                } else {
                    alert(data.message || 'Failed to initialize vault storage.');
                }
            } catch (error) {
                console.error('Error connecting to backend:', error);
                alert('Connection failed. Is your Node.js backend server running?');
            }
        });
    }

    // ---------------------------------------------------------------------
    // C. Optional standard Login Form Handler (If a full login form exists)
    // ---------------------------------------------------------------------
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailField = document.getElementById('email');
            const passwordField = document.getElementById('password');

            if (!emailField || !passwordField) return;

            const email = emailField.value;
            const password = passwordField.value;

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('userToken', data.token);
                    window.location.href = 'dashboard.html'; 
                } else {
                    alert(data.message || 'Invalid email or password!');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('Something went wrong. Is the backend server running?');
            }
        });
    }
});