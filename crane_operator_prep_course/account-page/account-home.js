document.addEventListener("DOMContentLoaded", () => {
    // 1. Retrieve stored user info (this could come from localStorage, sessionStorage, or a cookie)
    //    For testing/demo purposes, let's assume it's stored in localStorage under 'userEmail'.
    const userEmail = localStorage.getItem('userEmail') || 'Unknown User';
    
    // 2. Display the user’s email on the page
    document.getElementById('userEmail').textContent = userEmail;
  
    // 3. Handle "Log Out" button
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
      // Clear any saved session info (e.g., email) in localStorage
      localStorage.removeItem('userEmail');
  
      // Redirect the user back to your home page
      window.location.href = 'https://annualinspectionsusa.com';
    });
  });
  