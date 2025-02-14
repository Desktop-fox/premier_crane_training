/****************************************************
 * 1) Utility: Compress an image on the front end
 *    Returns a Promise that resolves to a Base64
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

        // Convert to Base64 in JPEG format with given quality
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
 * 2) Open file/camera when user clicks the camera icon
 ********************************************************/
function openCamera(inputId) {
  const fileInput = document.getElementById(inputId);
  if (fileInput) {
    // This input is set with capture="camera"
    fileInput.click();
  }
}

/********************************************************
 * 2b) Open a normal file upload (no camera capture)
 ********************************************************/
function openUpload(inputId) {
  const fileInput = document.getElementById(inputId);
  if (fileInput) {
    fileInput.click();
  }
}

/***************************************************************
 * 3) WAIT for DOMContentLoaded so everything is in the same scope
 ***************************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inspectionForm");
  const newFileBtn = document.getElementById("newFileBtn");

  // Function to clear the form
  function clearForm() {
    form.reset();
    localStorage.removeItem("telescopingBoomData");
    alert("Form cleared. You can now start a new inspection.");
  }

  // Function to prompt the user to save before clearing the form
  function promptSaveBeforeNewFile() {
    const savedData = localStorage.getItem("telescopingBoomData");
    if (savedData) {
      const confirmSave = confirm("Do you want to save your current progress before starting a new file?");
      if (confirmSave) {
        const dataObj = collectFormData();
        const dataStr = JSON.stringify(dataObj, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.download = "telescoping_inspection.json";
        tempLink.click();
        URL.revokeObjectURL(url);
        tempLink.remove();
      }
    }
    clearForm();
  }

  // Add event listener to the "New File" button
  if (newFileBtn) {
    newFileBtn.addEventListener("click", promptSaveBeforeNewFile);
  }

  /***********************************************
   * 4) doLocalSave - saves the form data to localStorage
   ***********************************************/
  function doLocalSave() {
    try {
      const dataObj = collectFormData();
      localStorage.setItem("telescopingBoomData", JSON.stringify(dataObj));
      // console.log("Local save complete");
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }

  /***********************************************
   * 5) collectFormData - gather all form fields
   ***********************************************/
  function collectFormData() {
    const formData = new FormData(form);
    const dataObj = {};

    // 5a) Put all standard form fields (text, checkboxes, etc.) into dataObj
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    // 5b) Also gather the base64-encoded images (hidden inputs that end in _dataURL)
    // Because they won't appear in FormData by default
    const hiddenDataUrlInputs = form.querySelectorAll('input[id$="_dataURL"]');
    hiddenDataUrlInputs.forEach((inp) => {
      dataObj[inp.id] = inp.value; // e.g. "boomInnerFileCamera_dataURL": "data:image/jpeg;base64,...."
    });

    return dataObj;
  }

  /***********************************************
   * 6) handlePhotoChange - compress & store images,
   *    check the "image-loaded" box
   ***********************************************/
  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return; // user canceled or no file

    compressImage(file, 1000, 0.4)
      .then((dataURL) => {
        // Create/Update hidden input
        const hiddenInputName = event.target.id + "_dataURL";
        let hiddenInput = document.getElementById(hiddenInputName);
        if (!hiddenInput) {
          hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.id = hiddenInputName;
          hiddenInput.name = hiddenInputName;
          event.target.closest('tr').appendChild(hiddenInput);
        }
        hiddenInput.value = dataURL;

        // Mark the "image loaded" checkbox as checked
        const checkId = event.target.id + "_check";
        const checkEl = document.getElementById(checkId);
        if (checkEl) {
          checkEl.checked = true;
        }

        // Save so we don't lose the photo
        doLocalSave();
      })
      .catch((err) => {
        console.error("Error compressing or reading file:", err);
      });
  }

  /***********************************************
   * 7) loadLocalData - repopulate checkboxes & text
   ***********************************************/
  function loadLocalData() {
    try {
      const savedString = localStorage.getItem("telescopingBoomData");
      if (!savedString) return;
      const savedData = JSON.parse(savedString);

      applyDataToForm(savedData);
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
    }
  }

  /***********************************************
   * 8) loadLocalPhotos - re-inject base64 images
   *    and re-check "image loaded" checkboxes
   ***********************************************/
  function loadLocalPhotos() {
    try {
      const savedString = localStorage.getItem("telescopingBoomData");
      if (!savedString) return;
      const savedData = JSON.parse(savedString);

      applyPhotosToForm(savedData);
    } catch (err) {
      console.error("Error loading local photos:", err);
    }
  }

  // Helper function: apply text/checkbox data to form
  function applyDataToForm(savedData) {
    for (const key in savedData) {
      const value = savedData[key];

      // If it's a standard checkbox
      const checkbox = document.querySelector(`input[name="${key}"][type="checkbox"]`);
      if (checkbox) {
        // For checkboxes, savedData might be "on" or "", etc.
        checkbox.checked = (value === "on");
        continue;
      }

      // If it's a normal input or text area
      const inputEl = document.querySelector(`#inspectionForm input[name="${key}"]`);
      if (inputEl && inputEl.type !== "checkbox" && inputEl.type !== "file") {
        inputEl.value = value;
        continue;
      }
      const textArea = document.querySelector(`#inspectionForm textarea[name="${key}"]`);
      if (textArea) {
        textArea.value = value;
        continue;
      }
    }
  }

  // Helper function: apply base64 photos to hidden inputs & preview
  function applyPhotosToForm(savedData) {
    for (const key in savedData) {
      if (key.endsWith("_dataURL")) {
        const base64Value = savedData[key];
        if (!base64Value) continue;

        let hiddenInput = document.getElementById(key);
        const fileInputId = key.replace("_dataURL", "");
        const fileInputEl = document.getElementById(fileInputId);

        // If hidden input doesn't exist yet, create it
        if (!hiddenInput && fileInputEl) {
          hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.id = key;
          hiddenInput.name = key;
          fileInputEl.closest('tr').appendChild(hiddenInput);
        }
        if (hiddenInput) {
          hiddenInput.value = base64Value;
        }

        // Re-check the associated "image-loaded" box
        const checkEl = document.getElementById(fileInputId + "_check");
        if (checkEl) {
          checkEl.checked = true;
        }

        // (Optional) If you want to show a little preview in the table
        let previewImg = fileInputEl?.closest("tr")?.querySelector(".photo-preview");
        if (!previewImg && fileInputEl) {
          previewImg = document.createElement("img");
          previewImg.classList.add("photo-preview");
          const lastTd = fileInputEl.closest("tr").lastElementChild;
          lastTd.appendChild(previewImg);
        }
        if (previewImg) {
          previewImg.src = base64Value;
        }
      }
    }
  }

  /***********************************************
   * 9) MAIN CODE FLOW
   ***********************************************/
  // 9a) Load any saved data
  loadLocalData();
  loadLocalPhotos();

  // 9b) Hook up file inputs
  const fileInputs = document.querySelectorAll('#inspectionForm input[type="file"]');
  fileInputs.forEach((input) => {
    input.addEventListener("change", handlePhotoChange);
  });

  // 9c) Any input changes => doLocalSave
  const allInputs = document.querySelectorAll("#inspectionForm input, #inspectionForm textarea");
  allInputs.forEach((el) => {
    el.addEventListener("change", doLocalSave);
  });

  // 9d) Periodic server save (example; remove if not needed)
  setInterval(() => {
    const dataObj = collectFormData();
    fetch("/save-inspection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataObj)
    })
      .then((res) => {
        if (!res.ok) {
          console.warn("Periodic save to server returned a non-200 status.");
        }
      })
      .catch((err) => console.error("Error saving to server:", err));
  }, 60000);

// ...
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // OPTIONAL: Ask user if they'd like to save before proceeding
  const wantToSave = confirm("Would you like to save a local copy of your inspection data before submitting?");

  if (wantToSave) {
    try {
      // Grab form data as an object
      const dataObj = collectFormData();
      const dataStr = JSON.stringify(dataObj, null, 2);

      // Create a downloadable "virtual link"
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = "telescoping_inspection.json";
      tempLink.click();
      URL.revokeObjectURL(url);
      tempLink.remove();
    } catch (err) {
      console.error("Error exporting JSON:", err);
      alert("Could not export JSON data.");
    }
  }

  // After the user chooses, also save to local storage
  const finalData = collectFormData();
  localStorage.setItem("telescopingBoomData", JSON.stringify(finalData));

  // Then go to the report page
  window.location.href = "telescopingreport.html";
});
// ...


  // ==============================================================
  // (A) NEW FEATURE: “SAVE TO JSON” & “LOAD FROM JSON” BUTTONS
  // ==============================================================

  // (A1) If you added <button id="saveJsonBtn"> and <button id="loadJsonBtn">, etc.
  const saveJsonBtn = document.getElementById("saveJsonBtn");
  const loadJsonBtn = document.getElementById("loadJsonBtn");
  const loadJsonInput = document.getElementById("loadJsonInput");

  // (A2) Save to JSON File (triggered by "Save to JSON" button)
  if (saveJsonBtn) {
    saveJsonBtn.addEventListener("click", () => {
      try {
        // Grab current form data as an object
        const dataObj = collectFormData();
        // Convert to pretty-printed JSON
        const dataStr = JSON.stringify(dataObj, null, 2);

        // Create a downloadable "virtual link"
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.download = "telescoping_inspection.json";
        tempLink.click();
        URL.revokeObjectURL(url);
        tempLink.remove();
      } catch (err) {
        console.error("Error exporting JSON:", err);
        alert("Could not export JSON data.");
      }
    });
  }

  // (A3) Load from JSON File
  if (loadJsonBtn && loadJsonInput) {
    // Show file-picker when user clicks "Load from JSON"
    loadJsonBtn.addEventListener("click", () => {
      loadJsonInput.click();
    });

    // When user selects a .json file, read & apply it
    loadJsonInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return; // user canceled

      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const jsonData = JSON.parse(e.target.result);
          // (A4) Actually apply to the form & localStorage
          applyDataToForm(jsonData);
          applyPhotosToForm(jsonData);

          // Save to localStorage so it persists on refresh
          localStorage.setItem("telescopingBoomData", JSON.stringify(jsonData));

          alert("Inspection data loaded successfully!");
        } catch (err) {
          console.error("Invalid JSON file:", err);
          alert("Error: Invalid JSON file.");
        }
      };
      reader.readAsText(file);
    });
  }
});
