document.addEventListener("DOMContentLoaded", () => {
  console.log("Loaded the UPDATED script.js"); // <-- to confirm you see this in DevTools

  // Get references to HTML elements
  const loginForm = document.getElementById("loginForm");
  const createAccountForm = document.getElementById("createAccountForm");

  const loginContainer = document.getElementById("loginContainer");
  const createAccountContainer = document.getElementById("createAccountContainer");

  const showCreateAccount = document.getElementById("showCreateAccount");
  const showLogin = document.getElementById("showLogin");

  // Toggle from Login to Create Account
  showCreateAccount.addEventListener("click", () => {
    loginContainer.classList.add("hidden");
    createAccountContainer.classList.remove("hidden");
  });

  // Toggle from Create Account back to Login
  showLogin.addEventListener("click", () => {
    createAccountContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
  });

  // ==============================
  // 1) Handle Create Account Form
  // ==============================
  createAccountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("createEmail").value;
    const password = document.getElementById("createPassword").value;
  
    createAccount(email, password);
  });
  
  function createAccount(email, password) {
    fetch('register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
      .then(res => res.text())
      .then(data => {
        console.log("Register response:", data);
        alert(data);
        if (data.includes("Account created successfully!")) {
          // Toggle back to the Login form automatically
          document.getElementById("showLogin").click();
        }
      })
      .catch(err => console.error("Register error:", err));
  }

  // =========================
  // 2) Handle Login Form
  // =========================
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    loginUser(email, password);
  });

  function loginUser(email, password) {
    fetch('login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
      .then(res => res.text())
      .then(data => {
        console.log("Login response:", data);
        if (data.includes("Login successful!")) {
          // Store user email locally
          localStorage.setItem('userEmail', email);
          // Redirect to the account page (adjust path if different)
          window.location.href = 'account-page/account-home.html';
        } else {
          // e.g. "Invalid password!" or "No account found with that email."
          alert(data);
        }
      })
      .catch(err => console.error("Login error:", err));
  }
});
