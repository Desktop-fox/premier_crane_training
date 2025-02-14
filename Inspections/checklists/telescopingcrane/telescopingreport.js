/***********************************************
 * telescopingreport.js
 *
 * This file reads inspection data from localStorage,
 * populates the final report table, and displays
 * uploaded photos in the Deficiencies/Hazards section.
 ***********************************************/

// 1) Define a base map from file input IDs to default/fallback item names
//    (We will override these for user-defined items if the user typed a custom name.)
const photoLabelMap = {
  // Telescoping Boom Sections
  boomInnerFileCamera: "Boom Inner Sections",
  boomOuterFileCamera: "Boom Outer Section",
  boomWearpadsFileCamera: "Boom Wear Pads",

  // Boom Cylinder
  pistonRodFileCamera: "Piston Rod",
  cylinderBarrelFileCamera: "Cylinder Barrel",

  // Boom Head
  boomHeadSheavesFileCamera: "Boom Head Sheaves",
  boomPointRollerFileCamera: "Boom Point Roller Bearings",
  loadBlockAttachmentsFileCamera: "Load Block Attachments",

  // Boom Base Section
  mountingPinsFileCamera: "Mounting Pins",
  baseHydraulicConnectionsFileCamera: "Base Hydraulic Connections",
  boomStopsFileCamera: "Boom Stops",

  // Extension Jibs
  fixedJibsFileCamera: "Fixed Jibs",
  luffingJibsFileCamera: "Luffing Jibs",
  jibPinConnectionsFileCamera: "Jib Pin Connections",

  // Sheaves (General)
  grooveLiningFileCamera: "Groove Lining",
  sheaveBearingsFileCamera: "Sheave Bearings",

  // Turntable
  rotexBearingFileCamera: "Rotex Bearing",
  turntableDriveMotorsFileCamera: "Turntable Drive Motors",
  turntableLubricationFileCamera: "Turntable Lubrication",

  // Operator’s Cab
  controlLeversFileCamera: "Control Levers",
  displayPanelsFileCamera: "Digital Display Panels",
  cabWindowsFileCamera: "Cab Windows",
  climateControlsFileCamera: "Climate Controls",

  // Counterweights
  stackableWeightsFileCamera: "Stackable Weights",
  counterweightAttachmentFileCamera: "Counterweight Attachment Mechanism",
  liftingEyesFileCamera: "Lifting Eyes",

  // Swing Mechanism
  swingGearFileCamera: "Swing Gear",
  swingMotorFileCamera: "Hydraulic Swing Motor",
  swingBrakeFileCamera: "Swing Brake",

  // Winch Systems
  mainWinchDrumFileCamera: "Main Winch (Drum)",
  mainWinchBrakeFileCamera: "Main Winch (Brake System)",
  mainWinchMotorFileCamera: "Main Winch (Hydraulic Motor)",
  auxWinchDrumFileCamera: "Auxiliary Winch (Drum)",
  auxWinchMotorFileCamera: "Auxiliary Winch (Motor)",

  // Hydraulic Pumps
  gearPumpFileCamera: "Gear Pump",
  pistonPumpFileCamera: "Piston Pump",

  // Carrier (Chassis)
  frameRailsFileCamera: "Frame Rails",
  axlesFileCamera: "Axles",

  // Outriggers
  outriggersTelescopicFileCamera: "Outriggers: Telescopic Arms",
  outriggersFootpadsFileCamera: "Outriggers: Foot Pads",
  outriggersCylindersFileCamera: "Outriggers: Hydraulic Cylinders",

  // Load Handling Equipment
  hookSafetyLatchFileCamera: "Hook Safety Latch",
  hookSwivelMechFileCamera: "Hook Swivel Mechanism",
  wireRopeCoreFileCamera: "Wire Rope (Core)",
  wireRopeStrandsFileCamera: "Wire Rope (Outer Strands)",
  overhaulBallWeightFileCamera: "Overhaul Ball (Weight)",
  overhaulBallSwivelFileCamera: "Overhaul Ball (Swivel Assembly)",
  shacklesFileCamera: "Shackles",
  slingsFileCamera: "Slings",
  spreaderBarsFileCamera: "Spreader Bars",

  // Hydraulic Systems
  hydCylSealsFileCamera: "Hydraulic Cylinder Seals",
  cylRodEndsFileCamera: "Cylinder Rod Ends",
  cylFluidPortsFileCamera: "Hydraulic Fluid Ports",
  tankFiltersFileCamera: "Hydraulic Reservoir (Tank Filters)",
  sightGaugeFileCamera: "Sight Gauge",
  hydLinesHosesFileCamera: "Hydraulic Lines (Hoses)",
  hydLinesFittingsFileCamera: "Hydraulic Lines (Fittings/Couplings)",

  // Safety & Monitoring Systems
  lmiSensorsFileCamera: "LMI Sensors",
  lmiDisplayFileCamera: "LMI Display Unit",
  antiTwoblockSwitchFileCamera: "Anti-Two-Block (Proximity Switch)",
  antiTwoblockAlarmFileCamera: "Anti-Two-Block (Alarm System)",
  outriggerLoadCellsFileCamera: "Outrigger Pressure Sensors (Load Cells)",
  craneBubbleLevelFileCamera: "Crane Level Indicator (Bubble Level)",
  craneDigitalLevelFileCamera: "Crane Level Indicator (Digital)",
  radiusIndicatorFileCamera: "Radius Indicator",

  // Additional Attachments - Fly Jib
  flyJibPivotFileCamera: "Fly Jib (Pivoting Mount)",
  flyJibExtensionPinsFileCamera: "Fly Jib (Extension Pins)",

  // User-Defined Attachments (fallback if no custom name is typed)
  userAttachment1FileCamera: "User Attachment #1",
  userAttachment2FileCamera: "User Attachment #2",
  userAttachment3FileCamera: "User Attachment #3",
  userAttachment4FileCamera: "User Attachment #4",
  userAttachment5FileCamera: "User Attachment #5",
};

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve data from localStorage
  const storedData = localStorage.getItem("telescopingBoomData");
  console.log("Retrieved data from localStorage:", storedData);

  if (!storedData) {
    alert("No inspection data found. Redirecting...");
    // If no data, redirect back to the form
    window.location.href = "telescopingcrane.html";
    return;
  }

  // Parse JSON
  const data = JSON.parse(storedData);
  console.log("Parsed data:", data);

  // Helper to set a check mark
  function setCheckMark(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = data[id] === "on" ? "✓" : "";
  }

  // Helper to set text
  function setText(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = data[id] || "";
  }

  // -------------------------------------
  // 1) Top Info Fields
  // -------------------------------------
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

  // -------------------------------------
  // 2) Check marks + remarks for each item
  //    (Repeat pattern for all form items)
  // -------------------------------------

  // -- BOOM ASSEMBLY (Telescoping Boom)
  setCheckMark("boom_inner_pass");
  setCheckMark("boom_inner_fail");
  setCheckMark("boom_inner_na");
  setText("boom_inner_remarks");

  setCheckMark("boom_outer_pass");
  setCheckMark("boom_outer_fail");
  setCheckMark("boom_outer_na");
  setText("boom_outer_remarks");

  setCheckMark("boom_wearpads_pass");
  setCheckMark("boom_wearpads_fail");
  setCheckMark("boom_wearpads_na");
  setText("boom_wearpads_remarks");

  // -- Boom Cylinder
  setCheckMark("piston_rod_pass");
  setCheckMark("piston_rod_fail");
  setCheckMark("piston_rod_na");
  setText("piston_rod_remarks");

  setCheckMark("cylinder_barrel_pass");
  setCheckMark("cylinder_barrel_fail");
  setCheckMark("cylinder_barrel_na");
  setText("cylinder_barrel_remarks");

  // -- Boom Head
  setCheckMark("boom_head_sheaves_pass");
  setCheckMark("boom_head_sheaves_fail");
  setCheckMark("boom_head_sheaves_na");
  setText("boom_head_sheaves_remarks");

  setCheckMark("boom_point_roller_pass");
  setCheckMark("boom_point_roller_fail");
  setCheckMark("boom_point_roller_na");
  setText("boom_point_roller_remarks");

  setCheckMark("load_block_attachments_pass");
  setCheckMark("load_block_attachments_fail");
  setCheckMark("load_block_attachments_na");
  setText("load_block_attachments_remarks");

  // -- Boom Base Section
  setCheckMark("mounting_pins_pass");
  setCheckMark("mounting_pins_fail");
  setCheckMark("mounting_pins_na");
  setText("mounting_pins_remarks");

  setCheckMark("base_hydraulic_connections_pass");
  setCheckMark("base_hydraulic_connections_fail");
  setCheckMark("base_hydraulic_connections_na");
  setText("base_hydraulic_connections_remarks");

  setCheckMark("boom_stops_pass");
  setCheckMark("boom_stops_fail");
  setCheckMark("boom_stops_na");
  setText("boom_stops_remarks");

  // -- Extension Jibs
  setCheckMark("fixed_jibs_pass");
  setCheckMark("fixed_jibs_fail");
  setCheckMark("fixed_jibs_na");
  setText("fixed_jibs_remarks");

  setCheckMark("luffing_jibs_pass");
  setCheckMark("luffing_jibs_fail");
  setCheckMark("luffing_jibs_na");
  setText("luffing_jibs_remarks");

  setCheckMark("jib_pin_connections_pass");
  setCheckMark("jib_pin_connections_fail");
  setCheckMark("jib_pin_connections_na");
  setText("jib_pin_connections_remarks");

  // -- Sheaves (General)
  setCheckMark("groove_lining_pass");
  setCheckMark("groove_lining_fail");
  setCheckMark("groove_lining_na");
  setText("groove_lining_remarks");

  setCheckMark("sheave_bearings_pass");
  setCheckMark("sheave_bearings_fail");
  setCheckMark("sheave_bearings_na");
  setText("sheave_bearings_remarks");

  // -------------------------------------
  //  SUPERSTRUCTURE
  // -------------------------------------
  // -- Turntable
  setCheckMark("rotex_bearing_pass");
  setCheckMark("rotex_bearing_fail");
  setCheckMark("rotex_bearing_na");
  setText("rotex_bearing_remarks");

  setCheckMark("turntable_drive_motors_pass");
  setCheckMark("turntable_drive_motors_fail");
  setCheckMark("turntable_drive_motors_na");
  setText("turntable_drive_motors_remarks");

  setCheckMark("turntable_lubrication_pass");
  setCheckMark("turntable_lubrication_fail");
  setCheckMark("turntable_lubrication_na");
  setText("turntable_lubrication_remarks");

  // -- Operator’s Cab
  setCheckMark("control_levers_pass");
  setCheckMark("control_levers_fail");
  setCheckMark("control_levers_na");
  setText("control_levers_remarks");

  setCheckMark("display_panels_pass");
  setCheckMark("display_panels_fail");
  setCheckMark("display_panels_na");
  setText("display_panels_remarks");

  setCheckMark("cab_windows_pass");
  setCheckMark("cab_windows_fail");
  setCheckMark("cab_windows_na");
  setText("cab_windows_remarks");

  setCheckMark("climate_controls_pass");
  setCheckMark("climate_controls_fail");
  setCheckMark("climate_controls_na");
  setText("climate_controls_remarks");

  // -- Counterweights
  setCheckMark("stackable_weights_pass");
  setCheckMark("stackable_weights_fail");
  setCheckMark("stackable_weights_na");
  setText("stackable_weights_remarks");

  setCheckMark("counterweight_attachment_pass");
  setCheckMark("counterweight_attachment_fail");
  setCheckMark("counterweight_attachment_na");
  setText("counterweight_attachment_remarks");

  setCheckMark("lifting_eyes_pass");
  setCheckMark("lifting_eyes_fail");
  setCheckMark("lifting_eyes_na");
  setText("lifting_eyes_remarks");

  // -- Swing Mechanism
  setCheckMark("swing_gear_pass");
  setCheckMark("swing_gear_fail");
  setCheckMark("swing_gear_na");
  setText("swing_gear_remarks");

  setCheckMark("swing_motor_pass");
  setCheckMark("swing_motor_fail");
  setCheckMark("swing_motor_na");
  setText("swing_motor_remarks");

  setCheckMark("swing_brake_pass");
  setCheckMark("swing_brake_fail");
  setCheckMark("swing_brake_na");
  setText("swing_brake_remarks");

  // -------------------------------------
  //  WINCH SYSTEMS
  // -------------------------------------
  setCheckMark("main_winch_drum_pass");
  setCheckMark("main_winch_drum_fail");
  setCheckMark("main_winch_drum_na");
  setText("main_winch_drum_remarks");

  setCheckMark("main_winch_brake_pass");
  setCheckMark("main_winch_brake_fail");
  setCheckMark("main_winch_brake_na");
  setText("main_winch_brake_remarks");

  setCheckMark("main_winch_motor_pass");
  setCheckMark("main_winch_motor_fail");
  setCheckMark("main_winch_motor_na");
  setText("main_winch_motor_remarks");

  setCheckMark("aux_winch_drum_pass");
  setCheckMark("aux_winch_drum_fail");
  setCheckMark("aux_winch_drum_na");
  setText("aux_winch_drum_remarks");

  setCheckMark("aux_winch_motor_pass");
  setCheckMark("aux_winch_motor_fail");
  setCheckMark("aux_winch_motor_na");
  setText("aux_winch_motor_remarks");

  // -------------------------------------
  //  HYDRAULIC PUMPS
  // -------------------------------------
  setCheckMark("gear_pump_pass");
  setCheckMark("gear_pump_fail");
  setCheckMark("gear_pump_na");
  setText("gear_pump_remarks");

  setCheckMark("piston_pump_pass");
  setCheckMark("piston_pump_fail");
  setCheckMark("piston_pump_na");
  setText("piston_pump_remarks");

  // -------------------------------------
  //  CARRIER (CHASSIS)
  // -------------------------------------
  // -- Truck Chassis
  setCheckMark("frame_rails_pass");
  setCheckMark("frame_rails_fail");
  setCheckMark("frame_rails_na");
  setText("frame_rails_remarks");

  setCheckMark("axles_pass");
  setCheckMark("axles_fail");
  setCheckMark("axles_na");
  setText("axles_remarks");

  // -- Outriggers
  setCheckMark("outriggers_telescopic_pass");
  setCheckMark("outriggers_telescopic_fail");
  setCheckMark("outriggers_telescopic_na");
  setText("outriggers_telescopic_remarks");

  setCheckMark("outriggers_footpads_pass");
  setCheckMark("outriggers_footpads_fail");
  setCheckMark("outriggers_footpads_na");
  setText("outriggers_footpads_remarks");

  setCheckMark("outriggers_cylinders_pass");
  setCheckMark("outriggers_cylinders_fail");
  setCheckMark("outriggers_cylinders_na");
  setText("outriggers_cylinders_remarks");

  // -------------------------------------
  //  LOAD HANDLING EQUIPMENT
  // -------------------------------------
  // -- Load Hook
  setCheckMark("hook_safety_latch_pass");
  setCheckMark("hook_safety_latch_fail");
  setCheckMark("hook_safety_latch_na");
  setText("hook_safety_latch_remarks");

  setCheckMark("hook_swivel_mech_pass");
  setCheckMark("hook_swivel_mech_fail");
  setCheckMark("hook_swivel_mech_na");
  setText("hook_swivel_mech_remarks");

  // -- Wire Rope
  setCheckMark("wire_rope_core_pass");
  setCheckMark("wire_rope_core_fail");
  setCheckMark("wire_rope_core_na");
  setText("wire_rope_core_remarks");

  setCheckMark("wire_rope_strands_pass");
  setCheckMark("wire_rope_strands_fail");
  setCheckMark("wire_rope_strands_na");
  setText("wire_rope_strands_remarks");

  // -- Overhaul Ball
  setCheckMark("overhaul_ball_weight_pass");
  setCheckMark("overhaul_ball_weight_fail");
  setCheckMark("overhaul_ball_weight_na");
  setText("overhaul_ball_weight_remarks");

  setCheckMark("overhaul_ball_swivel_pass");
  setCheckMark("overhaul_ball_swivel_fail");
  setCheckMark("overhaul_ball_swivel_na");
  setText("overhaul_ball_swivel_remarks");

  // -- Rigging Hardware
  setCheckMark("shackles_pass");
  setCheckMark("shackles_fail");
  setCheckMark("shackles_na");
  setText("shackles_remarks");

  setCheckMark("slings_pass");
  setCheckMark("slings_fail");
  setCheckMark("slings_na");
  setText("slings_remarks");

  setCheckMark("spreader_bars_pass");
  setCheckMark("spreader_bars_fail");
  setCheckMark("spreader_bars_na");
  setText("spreader_bars_remarks");

  // -------------------------------------
  //  HYDRAULIC SYSTEMS
  // -------------------------------------
  // -- Hydraulic Cylinders
  setCheckMark("hyd_cyl_seals_pass");
  setCheckMark("hyd_cyl_seals_fail");
  setCheckMark("hyd_cyl_seals_na");
  setText("hyd_cyl_seals_remarks");

  setCheckMark("cyl_rod_ends_pass");
  setCheckMark("cyl_rod_ends_fail");
  setCheckMark("cyl_rod_ends_na");
  setText("cyl_rod_ends_remarks");

  setCheckMark("cyl_fluid_ports_pass");
  setCheckMark("cyl_fluid_ports_fail");
  setCheckMark("cyl_fluid_ports_na");
  setText("cyl_fluid_ports_remarks");

  // -- Hydraulic Reservoir
  setCheckMark("tank_filters_pass");
  setCheckMark("tank_filters_fail");
  setCheckMark("tank_filters_na");
  setText("tank_filters_remarks");

  setCheckMark("sight_gauge_pass");
  setCheckMark("sight_gauge_fail");
  setCheckMark("sight_gauge_na");
  setText("sight_gauge_remarks");

  // -- Hydraulic Lines
  setCheckMark("hyd_lines_hoses_pass");
  setCheckMark("hyd_lines_hoses_fail");
  setCheckMark("hyd_lines_hoses_na");
  setText("hyd_lines_hoses_remarks");

  setCheckMark("hyd_lines_fittings_pass");
  setCheckMark("hyd_lines_fittings_fail");
  setCheckMark("hyd_lines_fittings_na");
  setText("hyd_lines_fittings_remarks");

  // -------------------------------------
  //  SAFETY & MONITORING SYSTEMS
  // -------------------------------------
  // -- LMI
  setCheckMark("lmi_sensors_pass");
  setCheckMark("lmi_sensors_fail");
  setCheckMark("lmi_sensors_na");
  setText("lmi_sensors_remarks");

  setCheckMark("lmi_display_pass");
  setCheckMark("lmi_display_fail");
  setCheckMark("lmi_display_na");
  setText("lmi_display_remarks");

  // -- Anti-Two-Block
  setCheckMark("anti_twoblock_switch_pass");
  setCheckMark("anti_twoblock_switch_fail");
  setCheckMark("anti_twoblock_switch_na");
  setText("anti_twoblock_switch_remarks");

  setCheckMark("anti_twoblock_alarm_pass");
  setCheckMark("anti_twoblock_alarm_fail");
  setCheckMark("anti_twoblock_alarm_na");
  setText("anti_twoblock_alarm_remarks");

  // -- Outrigger Pressure Sensors
  setCheckMark("outrigger_load_cells_pass");
  setCheckMark("outrigger_load_cells_fail");
  setCheckMark("outrigger_load_cells_na");
  setText("outrigger_load_cells_remarks");

  // -- Crane Level Indicator
  setCheckMark("crane_bubble_level_pass");
  setCheckMark("crane_bubble_level_fail");
  setCheckMark("crane_bubble_level_na");
  setText("crane_bubble_level_remarks");

  setCheckMark("crane_digital_level_pass");
  setCheckMark("crane_digital_level_fail");
  setCheckMark("crane_digital_level_na");
  setText("crane_digital_level_remarks");

  // -- Radius Indicator
  setCheckMark("radius_indicator_pass");
  setCheckMark("radius_indicator_fail");
  setCheckMark("radius_indicator_na");
  setText("radius_indicator_remarks");

  // -------------------------------------
  //  ADDITIONAL ATTACHMENTS - Fly Jib
  // -------------------------------------
  setCheckMark("fly_jib_pivot_pass");
  setCheckMark("fly_jib_pivot_fail");
  setCheckMark("fly_jib_pivot_na");
  setText("fly_jib_pivot_remarks");

  setCheckMark("fly_jib_extension_pins_pass");
  setCheckMark("fly_jib_extension_pins_fail");
  setCheckMark("fly_jib_extension_pins_na");
  setText("fly_jib_extension_pins_remarks");

  // -------------------------------------
  //  USER-DEFINED ATTACHMENTS (1–5)
  // -------------------------------------
  // Each has three checkboxes + name + desc + remarks
  setCheckMark("user_attachment_1_pass");
  setCheckMark("user_attachment_1_fail");
  setCheckMark("user_attachment_1_na");
  setText("user_attachment_1_name");
  setText("user_attachment_1_desc");
  setText("user_attachment_1_remarks");

  setCheckMark("user_attachment_2_pass");
  setCheckMark("user_attachment_2_fail");
  setCheckMark("user_attachment_2_na");
  setText("user_attachment_2_name");
  setText("user_attachment_2_desc");
  setText("user_attachment_2_remarks");

  setCheckMark("user_attachment_3_pass");
  setCheckMark("user_attachment_3_fail");
  setCheckMark("user_attachment_3_na");
  setText("user_attachment_3_name");
  setText("user_attachment_3_desc");
  setText("user_attachment_3_remarks");

  setCheckMark("user_attachment_4_pass");
  setCheckMark("user_attachment_4_fail");
  setCheckMark("user_attachment_4_na");
  setText("user_attachment_4_name");
  setText("user_attachment_4_desc");
  setText("user_attachment_4_remarks");

  setCheckMark("user_attachment_5_pass");
  setCheckMark("user_attachment_5_fail");
  setCheckMark("user_attachment_5_na");
  setText("user_attachment_5_name");
  setText("user_attachment_5_desc");
  setText("user_attachment_5_remarks");

  // -------------------------------------
  //  SIGNATURE & EMAILS
  // -------------------------------------
  setText("signature");
  setText("email1");
  setText("email2");

  // -------------------------------------
  //  Print button
  // -------------------------------------
  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // -------------------------------------
  //  Save (Download) button => Save JSON
  // -------------------------------------
  const saveLocalBtn = document.getElementById("saveLocalBtn");
  if (saveLocalBtn) {
    saveLocalBtn.addEventListener("click", () => {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `telescoping_inspection_${data.inspectionDate || "data"}.json`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  // -------------------------------------
  //  Insert any photos into Deficiencies/Hazards
  // -------------------------------------
  const photosContainer = document.getElementById("photosContainer");
  if (photosContainer) {
    for (const key in data) {
      if (!key.endsWith("_dataURL")) continue;

      // e.g. key = "boomInnerFileCamera_dataURL"
      const base64Image = data[key];
      if (!base64Image) continue;

      // baseId e.g. "boomInnerFileCamera"
      const baseId = key.replace("_dataURL", "");

      // 1) Start with the fallback label from photoLabelMap
      let itemName = photoLabelMap[baseId] || "Unknown Attachment";

      // 2) If this is a user-defined attachment, override
      //    with the actual name typed by the user
      if (baseId.startsWith("userAttachment")) {
        // userAttachment1FileCamera => "1"
        // userAttachment2FileCamera => "2", etc.
        // Grab the digit after "userAttachment"
        const attachNumber = baseId.replace("userAttachment", "").charAt(0);
        const customNameKey = `user_attachment_${attachNumber}_name`;
        const customName = data[customNameKey];

        if (customName && customName.trim() !== "") {
          itemName = customName;
        }
      }

      // Create container div for each photo + label
      const photoDiv = document.createElement("div");
      photoDiv.classList.add("photo-item");

      const titleEl = document.createElement("h3");
      titleEl.textContent = itemName;
      photoDiv.appendChild(titleEl);

      const imgEl = document.createElement("img");
      imgEl.src = base64Image;
      imgEl.alt = itemName;
      imgEl.style.maxWidth = "200px";
      photoDiv.appendChild(imgEl);

      photosContainer.appendChild(photoDiv);
    }
  }
  
    // 3) *** Put your user-attachment row-hiding code here ***
    for (let i = 1; i <= 5; i++) {
      const row = document.querySelector(`#user_attachment_${i}_name`)?.closest('tr');
      if (!row) continue;
  
      const fields = [
        `#user_attachment_${i}_name`,
        `#user_attachment_${i}_desc`,
        `#user_attachment_${i}_pass`,
        `#user_attachment_${i}_fail`,
        `#user_attachment_${i}_na`,
        `#user_attachment_${i}_remarks`
      ].map(sel => document.querySelector(sel)?.textContent.trim() || "");
  
      const allEmpty = fields.every(text => text === "");
      if (allEmpty) {
        row.style.display = 'none'; // hide the entire <tr>
      }
    }

});
