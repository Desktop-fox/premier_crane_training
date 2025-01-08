document.addEventListener("DOMContentLoaded", () => {
  // Retrieve data
  const storedData = localStorage.getItem("boomTruckCraneData");
  if(!storedData) {
    alert("No inspection data found. Redirecting...");
    window.location.href = "boomtruckcrane.html";
    return;
  }
  const data = JSON.parse(storedData);

  // Helper: checkmark if 'on'
  function setCheckMark(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = (data[id] === "on") ? "✓" : "";
  }
  // Helper: text
  function setText(id) {
    const el = document.getElementById(id);
    if(!el) return;
    el.textContent = data[id] || "";
  }

  // Top info
  setText("owner");
  setText("inspectionDate");
  setText("location");
  setText("serviceStatus");
  setText("make");
  setText("model");
  setText("serialNumber");
  setText("unitId");
  setText("maxCapacity");
  setText("inspectorName");

  // Fill each pass/fail/na/remarks
  setCheckMark("boom_inner_pass"); setCheckMark("boom_inner_fail"); setCheckMark("boom_inner_na"); setText("boom_inner_remarks");
  setCheckMark("boom_outer_pass"); setCheckMark("boom_outer_fail"); setCheckMark("boom_outer_na"); setText("boom_outer_remarks");
  setCheckMark("boom_wearpads_pass"); setCheckMark("boom_wearpads_fail"); setCheckMark("boom_wearpads_na"); setText("boom_wearpads_remarks");

  // ...Repeat for all rows: piston_rod_pass, piston_rod_fail, etc....

  // Signature & Emails
  setText("signature");
  setText("email1");
  setText("email2");

  // Print
  const printBtn = document.getElementById("printBtn");
  printBtn.addEventListener("click", () => {
    window.print();
  });
});