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
  
          // Convert to Base64 in JPEG format
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
   *  2) Open file/camera when user clicks the camera icon
   ********************************************************/
  function openCamera(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click(); // capture="camera"
    }
  }
  
  /********************************************************
   *  2b) Open a normal file upload (no camera capture)
   ********************************************************/
  function openUpload(inputId) {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click();
    }
  }
  
  /***************************************************************
   *  3) WAIT for DOMContentLoaded so everything is in the same scope
   ***************************************************************/
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inspectionForm");
  
    /***********************************************
     * 4) doLocalSave - saves the form data to localStorage
     ***********************************************/
    function doLocalSave() {
      try {
        const dataObj = collectFormData();
        localStorage.setItem("towerCraneData", JSON.stringify(dataObj));
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
  
      formData.forEach((value, key) => {
        dataObj[key] = value;
      });
  
      // Some fields are handled outside of standard name= usage
      if (document.getElementById("owner")) {
        dataObj.owner = document.getElementById("owner").value;
      }
      // Repeat for other top-level fields if needed...
  
      return dataObj;
    }
  
    /***********************************************
     * 6) handlePhotoChange - compress & store images
     ***********************************************/
    function handlePhotoChange(event) {
      const file = event.target.files[0];
      if (!file) return; // user canceled or no file
  
      // Compress
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
  
          // Immediately save so we don't lose the photo
          doLocalSave();
        })
        .catch((err) => {
          console.error("Error compressing or reading file:", err);
        });
    }
  
    /***********************************************
     * 7) loadLocalData - repopulate form from localStorage
     ***********************************************/
    function loadLocalData() {
      try {
        const savedString = localStorage.getItem("towerCraneData");
        if (!savedString) return;
        const savedData = JSON.parse(savedString);
  
        for (const key in savedData) {
          const value = savedData[key];
          
          // Checkboxes: if stored value was "on", set it
          const checkbox = document.querySelector(`input[name="${key}"][type="checkbox"]`);
          if (checkbox && value === "on") {
            checkbox.checked = true;
            continue;
          }
  
          // Normal input or text area
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
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    }
  
    /***********************************************
     * 8) loadLocalPhotos - re-inject base64 images
     ***********************************************/
    function loadLocalPhotos() {
      try {
        const savedString = localStorage.getItem("towerCraneData");
        if (!savedString) return;
        const savedData = JSON.parse(savedString);
  
        for (const key in savedData) {
          if (key.endsWith("_dataURL")) {
            const base64Value = savedData[key];
            if (!base64Value) continue;
  
            // Re-create hidden input for photo
            let hiddenInput = document.getElementById(key);
            if (!hiddenInput) {
              hiddenInput = document.createElement("input");
              hiddenInput.type = "hidden";
              hiddenInput.id = key;
              hiddenInput.name = key;
              // Attempt to find the nearest row for that ID
              const fileInputId = key.replace("_dataURL", "");
              const fileInputEl = document.getElementById(fileInputId);
              if (fileInputEl && fileInputEl.closest("tr")) {
                fileInputEl.closest("tr").appendChild(hiddenInput);
              }
            }
            hiddenInput.value = base64Value;
  
            // Also check the "image loaded" checkbox
            const checkId = key.replace("_dataURL", "_check");
            const checkEl = document.getElementById(checkId);
            if (checkEl) {
              checkEl.checked = true;
            }
          }
        }
      } catch (err) {
        console.error("Error loading local photos:", err);
      }
    }
  
    /***********************************************
     * 9) MAIN CODE FLOW
     ***********************************************/
    // 9a) load any saved data
    loadLocalData();
    loadLocalPhotos();
  
    // 9b) Hook up file inputs to handlePhotoChange
    const fileInputs = document.querySelectorAll('#inspectionForm input[type="file"]');
    fileInputs.forEach((input) => {
      input.addEventListener("change", (event) => handlePhotoChange(event));
    });
  
    // 9c) Any input changes => doLocalSave
    const allInputs = document.querySelectorAll("#inspectionForm input, #inspectionForm textarea");
    allInputs.forEach((el) => {
      el.addEventListener("change", doLocalSave);
    });
  
    // 9d) Periodic server save (dummy example; you can remove if not needed)
    setInterval(() => {
      const dataObj = collectFormData();
      fetch("/save-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataObj)
      })
      .then((res) => {
        if (res.ok) {
          // console.log("Periodic save to server successful.");
        } else {
          console.warn("Periodic save to server returned a non-200 status.");
        }
      })
      .catch((err) => console.error("Error saving to server:", err));
    }, 60000);
  
    // 9e) Final form submission
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const finalData = collectFormData();
      localStorage.setItem("towerCraneData", JSON.stringify(finalData));
  
      // Example: redirect to a summary page, or do an AJAX post, etc.
      window.location.href = "towercranereport.html";
    });
  });
  