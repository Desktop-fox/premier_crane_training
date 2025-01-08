document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("boomTruckForm");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      // Collect all data from form
      const formData = new FormData(form);
      const dataObj = {};
  
      formData.forEach((value, key) => {
        dataObj[key] = value;
      });
  
      // Also capture top-level fields if they're outside <form> (but here they're inside, so okay)
  
      // Save to localStorage
      localStorage.setItem("boomTruckCraneData", JSON.stringify(dataObj));
  
      // Redirect to final report
      window.location.href = "boomtruckreport.html";
    });
  });
  