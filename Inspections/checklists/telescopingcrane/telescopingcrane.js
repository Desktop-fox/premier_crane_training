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
        
        // Convert to a Base64 in JPEG format with given quality
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
    // This input is set with capture="camera"
    fileInput.click();
  }
}

/********************************************************
 *  2b) Open a normal file upload (no camera capture)
 ********************************************************/
function openUpload(inputId) {
  const fileInput = document.getElementById(inputId);
  if (fileInput) {
    // This input does NOT have capture="camera"
    fileInput.click();
  }
}

/**************************************************************
 *  3) Convert (and compress) the selected photo to Base64
 *     Then store it in a hidden input
 **************************************************************/
function handlePhotoChange(event, previewId = "") {
  const file = event.target.files[0];
  if (!file) return; // user canceled or no file selected

  // Compress the image before storing
  compressImage(file, 1000, 0.4)
    .then((dataURL) => {
      // dataURL is the compressed Base64

      // (Optional) If you want an immediate preview in the form, uncomment below:
      /*
      if (previewId) {
        let previewImg = document.getElementById(previewId);
        if (!previewImg) {
          previewImg = document.createElement('img');
          previewImg.id = previewId;
          previewImg.style.maxWidth = '200px';
          // Place the preview image anywhere you prefer
          event.target.closest('tr').appendChild(previewImg);
        }
        previewImg.src = dataURL;
      }
      */

      // Store the Base64 data in a hidden input so it’s submitted with the form
      const hiddenInputName = event.target.id + '_dataURL'; // e.g. "boomInnerFileCamera_dataURL"
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

      // Also do an immediate local save so we don't lose the photo
      doLocalSave();
    })
    .catch((err) => {
      console.error("Error compressing or reading file:", err);
      // Optional: fallback to direct readAsDataURL if compression fails
    });
}

/***************************************************************
 *  4) On DOMContentLoaded, set up event listeners for auto-save
 ***************************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inspectionForm");

  // Attach the "change" event to ALL file inputs (both camera & normal upload)
  const fileInputs = document.querySelectorAll('#inspectionForm input[type="file"]');
  fileInputs.forEach((input) => {
    input.addEventListener('change', (event) => handlePhotoChange(event));
  });

  // Any input change triggers a local save
  const allInputs = document.querySelectorAll("#inspectionForm input, #inspectionForm textarea");
  allInputs.forEach((el) => {
    el.addEventListener("change", doLocalSave);
  });

  /*****************************************
   * Collect all form data + store locally
   *****************************************/
  function doLocalSave() {
    try {
      const dataObj = collectFormData();
      localStorage.setItem("telescopingBoomData", JSON.stringify(dataObj));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }

  function collectFormData() {
    const formData = new FormData(form);
    const dataObj = {};

    // Convert form fields into an object
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    // Also grab top-level fields (if they exist in your HTML)
    // (Mostly redundant because they're already in the form,
    // but you can keep this if you prefer.)
    if (document.getElementById("owner")) {
      dataObj.owner = document.getElementById("owner").value;
    }
    if (document.getElementById("inspectionDate")) {
      dataObj.inspectionDate = document.getElementById("inspectionDate").value;
    }
    if (document.getElementById("location")) {
      dataObj.location = document.getElementById("location").value;
    }
    if (document.getElementById("serviceStatus")) {
      dataObj.serviceStatus = document.getElementById("serviceStatus").value;
    }
    if (document.getElementById("make")) {
      dataObj.make = document.getElementById("make").value;
    }
    if (document.getElementById("model")) {
      dataObj.model = document.getElementById("model").value;
    }
    if (document.getElementById("serialNumber")) {
      dataObj.serialNumber = document.getElementById("serialNumber").value;
    }
    if (document.getElementById("unitId")) {
      dataObj.unitId = document.getElementById("unitId").value;
    }
    if (document.getElementById("maxCapacity")) {
      dataObj.maxCapacity = document.getElementById("maxCapacity").value;
    }
    if (document.getElementById("inspectorName")) {
      dataObj.inspectorName = document.getElementById("inspectorName").value;
    }
    // signature & emails are already in the form

    return dataObj;
  }

  /*****************************************
   * Periodic server save (e.g. every 60s)
   *****************************************/
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
        console.warn("Periodic save to server returned a non-200 status.");
      }
    })
    .catch((err) => console.error("Error saving to server:", err));
  }, 60000); // 60 seconds

  /*****************************************
   * 5) Final form submission
   *****************************************/
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Save one last time to localStorage
    const finalData = collectFormData();
    localStorage.setItem("telescopingBoomData", JSON.stringify(finalData));

    // Redirect to final report
    window.location.href = "telescopingreport.html";
  });
});
