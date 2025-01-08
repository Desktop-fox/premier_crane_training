// When user clicks on an inspection item, redirect to the corresponding form page
// For now, we just show an alert. You can replace with the actual form page link.

document.addEventListener("DOMContentLoaded", function() {
    const inspectionItems = document.querySelectorAll(".inspection-item");
  
    inspectionItems.forEach(item => {
      item.addEventListener("click", function() {
        const equipmentType = this.dataset.equipment;
        // Placeholder for redirecting to a new page (e.g., formTelescoping.html, etc.)
        // Example:
        // window.location.href = `forms/${equipmentType}Form.html`;
  
        alert(`You selected: ${equipmentType}.\nRedirect to the corresponding inspection form here.`);
      });
    });
  });
  