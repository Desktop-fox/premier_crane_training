/****************************************************
 *  1) Utility: Compress an image on the front end
 *     Returns a Promise that resolves to a Base64
 ****************************************************/
function compressImage(file, maxWidth = 1000, quality = 0.4) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // Calculate new size to maintain aspect ratio
          const ratio = img.width / img.height;
          let newWidth = maxWidth;
          let newHeight = newWidth / ratio;
          
          // Create a canvas
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext('2d');
          
          // Draw the image at the new size
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Convert to Base64 (JPEG) with given quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result; // Original FileReader result
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  /********************************************************
   *  2) Functions to open camera or file upload
   ********************************************************/
  function openCamera(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput) fileInput.click();
  }
  
  function openUpload(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput) fileInput.click();
  }
  
  /**************************************************************
   *  3) Handle photo changes -> compress -> store as hidden input
   **************************************************************/
  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return; // user canceled or no file selected
  
    compressImage(file, 1000, 0.4)
      .then((dataURL) => {
        // Store the Base64 data in a hidden input
        const hiddenInputName = event.target.id + '_dataURL';
        let hiddenInput = document.getElementById(hiddenInputName);
        if (!hiddenInput) {
          hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.id = hiddenInputName;
          hiddenInput.name = hiddenInputName;
          // Attach to the same <tr> as the file input
          event.target.closest('tr').appendChild(hiddenInput);
        }
        hiddenInput.value = dataURL;
  
        // Also do immediate local save
        doLocalSave();
      })
      .catch((err) => {
        console.error("Error compressing or reading file:", err);
      });
  }
  
  /******************************************************************
   *  4) On DOMContentLoaded -> set up event listeners for auto-save
   ******************************************************************/
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inspectionForm");
    const reportContainer = document.getElementById("reportContainer");
    const reportContent = document.getElementById("reportContent");
  
    // Hook up file inputs
    const fileInputs = document.querySelectorAll('#inspectionForm input[type="file"]');
    fileInputs.forEach((input) => {
      input.addEventListener('change', handlePhotoChange);
    });
  
    // Any input change triggers local save
    const allInputs = document.querySelectorAll("#inspectionForm input, #inspectionForm textarea");
    allInputs.forEach((el) => {
      el.addEventListener("change", doLocalSave);
    });
  
    // Periodic server save (every 60s) - optional
    setInterval(() => {
      const dataObj = collectFormData();
      fetch("/save-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj)
      })
        .then((res) => {
          if (res.ok) {
            console.log("Periodic save to server successful.");
          } else {
            console.warn("Periodic save returned non-200.");
          }
        })
        .catch((err) => console.error("Error saving to server:", err));
    }, 60000);
  
    // Final submit
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      // 1) Save one last time
      const finalData = collectFormData();
      localStorage.setItem("telescopingBoomData", JSON.stringify(finalData));
      // 2) Hide the form
      form.style.display = "none";
      // 3) Build a “final report” table that looks like the original
      const finalReportHtml = buildFinalReport();
      reportContent.innerHTML = finalReportHtml;
      // 4) Show the report
      reportContainer.style.display = "block";
    });
  });
  
  /***************************************************************
   *  Collect all form data into an object for localStorage or server
   ***************************************************************/
  function collectFormData() {
    const form = document.getElementById("inspectionForm");
    const formData = new FormData(form);
    const dataObj = {};
  
    // Convert everything to a plain object
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });
  
    return dataObj;
  }
  
  /***************************************************************
   *  Save to localStorage whenever inputs change
   ***************************************************************/
  function doLocalSave() {
    try {
      const dataObj = collectFormData();
      localStorage.setItem("telescopingBoomData", JSON.stringify(dataObj));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }
  
  /************************************************************************
   *  Build a full table that “mirrors” the original, with the user’s data.
   *  - Pass/Fail/NA columns show a “✓” if selected
   *  - Remarks show the typed text
   *  - Photos are displayed if any
   ************************************************************************/
  function buildFinalReport() {
    // Let’s build an HTML string for the entire table
    // We’ll mimic your table structure
    let tableHtml = `
      <h2 style="text-align:center;">Final Inspection Report</h2>
  
      <!-- Top-level info (Owner, Date, etc.) -->
      <div>
        <strong>Owner:</strong> ${getVal("owner")}<br>
        <strong>Date:</strong> ${getVal("inspectionDate")}<br>
        <strong>Location:</strong> ${getVal("location")}<br>
        <strong>Service Status:</strong> ${getVal("serviceStatus")}<br>
        <strong>Make / Model:</strong> ${getVal("make")} / ${getVal("model")}<br>
        <strong>Serial / Unit ID:</strong> ${getVal("serialNumber")} / ${getVal("unitId")}<br>
        <strong>Max Capacity:</strong> ${getVal("maxCapacity")}<br>
        <strong>Inspector:</strong> ${getVal("inspectorName")}<br>
        <strong>Signature:</strong> ${getVal("signature")}<br>
        <strong>Email 1:</strong> ${getVal("email1")} | 
        <strong>Email 2:</strong> ${getVal("email2")}
      </div>
  
      <hr>
  
      <!-- Now replicate the table -->
      <table border="1" style="border-collapse: collapse; width:100%;">
        <thead>
          <tr>
            <th>System/Part</th>
            <th>Item / Description</th>
            <th>Pass</th>
            <th>Fail</th>
            <th>N/A</th>
            <th>Remarks</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
    `;
  
    // Grab all the original rows in the “form” table
    const originalRows = document.querySelectorAll("#inspectionForm table tbody tr");
    originalRows.forEach((row) => {
      // If it's a section or sub-header row
      if (row.classList.contains("section-header") || row.classList.contains("sub-header")) {
        // Example: <td colspan="7">Boom Assembly (Telescoping Boom)</td>
        const cell = row.querySelector("td");
        if (cell) {
          tableHtml += `
            <tr class="${row.className}">
              <td colspan="7">${cell.innerText}</td>
            </tr>
          `;
        }
      } 
      else {
        // It's a “data row” (with pass/fail/na checkboxes, remarks, etc.)
        const cells = row.querySelectorAll("td");
        if (cells.length === 7) {
          // Extract the text from the first two cells
          const systemPart = cells[0].innerText.trim();
          const itemDesc   = cells[1].innerText.trim();
  
          // For pass/fail/na, each row typically has 3 checkboxes in cells[2], [3], [4].
          // But we can read them by querySelectorAll('input[type="checkbox"]')
          const checkboxes = row.querySelectorAll('input[type="checkbox"]');
          const passCheck = (checkboxes[0] && checkboxes[0].checked) ? "✓" : "";
          const failCheck = (checkboxes[1] && checkboxes[1].checked) ? "✓" : "";
          const naCheck   = (checkboxes[2] && checkboxes[2].checked) ? "✓" : "";
  
          // Remarks is in cell[5], which has <input> or <textarea>
          const remarksInput = cells[5].querySelector("input, textarea");
          const remarksVal = remarksInput ? remarksInput.value : "";
  
          // Photo is in cell[6]. We should see if there's a hidden input with the Base64
          // e.g. <input id="boomInnerFileCamera_dataURL" value="data:image/jpeg;base64,..." />
          let photoHtml = "";
          const hiddenPhoto = row.querySelector('input[type="hidden"][id$="_dataURL"]');
          if (hiddenPhoto && hiddenPhoto.value) {
            photoHtml = `<img src="${hiddenPhoto.value}" alt="Photo" style="max-width:150px;" />`;
          }
  
          tableHtml += `
            <tr>
              <td>${systemPart}</td>
              <td>${itemDesc}</td>
              <td style="text-align:center;">${passCheck}</td>
              <td style="text-align:center;">${failCheck}</td>
              <td style="text-align:center;">${naCheck}</td>
              <td>${remarksVal}</td>
              <td>${photoHtml}</td>
            </tr>
          `;
        }
      }
    });
  
    tableHtml += `
        </tbody>
      </table>
    `;
  
    return tableHtml;
  }
  
  /** Helper to safely read an input’s value by ID **/
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? (el.value || "") : "";
  }
  
  /***********************************************************
   *  Copy the final report text to the user’s clipboard
   ***********************************************************/
  function copyReportToClipboard() {
    const reportContent = document.getElementById("reportContent");
    if (!reportContent) return;
  
    // Because we have a bunch of HTML, we’ll copy the innerText or we can do advanced styling
    const textToCopy = reportContent.innerText;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert("Report copied to clipboard!"))
      .catch((err) => {
        console.error("Failed to copy:", err);
        alert("Unable to copy. Please try manually.");
      });
  }
  
  /***********************************************************
   *  Email the report – (very basic mailto: approach)
   ***********************************************************/
  function emailReport() {
    const rawData = localStorage.getItem("telescopingBoomData");
    if (!rawData) {
      alert("No data found to email!");
      return;
    }
    const data = JSON.parse(rawData);
    const subject = encodeURIComponent(`Crane Inspection Report - ${data.inspectorName || ""}`);
  
    // This is a simplified text body
    const bodyText = `
  Owner: ${data.owner || ""}
  Date: ${data.inspectionDate || ""}
  Location: ${data.location || ""}
  Service Status: ${data.serviceStatus || ""}
  Make / Model: ${data.make || ""} / ${data.model || ""}
  Serial / Unit: ${data.serialNumber || ""} / ${data.unitId || ""}
  Inspector: ${data.inspectorName || ""}
  Signature: ${data.signature || ""}
  `.trim();
  
    let recipients = "";
    if (data.email1) recipients += data.email1;
    if (data.email2) recipients += (recipients ? "," : "") + data.email2;
  
    const mailtoLink = `mailto:${recipients}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoLink;
  }
  
  /***********************************************************
   *  Print the current page (which shows the final report)
   ***********************************************************/
  function printReport() {
    window.print();
  }
  