document.addEventListener("DOMContentLoaded", () => {
  // Retrieve data from localStorage
  const storedData = localStorage.getItem("telescopingBoomData");
  console.log("Retrieved data from localStorage:", storedData);

  if (!storedData) {
    alert("No inspection data found. Redirecting...");
    // If no data, redirect back to the form
    window.location.href = "telescopingBoomCrane.html";
    return;
  }

  // Parse JSON
  const data = JSON.parse(storedData);
  console.log("Parsed data:", data);

  // Helpers to fill the final report
  function setCheckMark(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Element with ID '${id}' not found`);
      return;
    }
    // If user checked the box, the value was "on"
    el.textContent = data[id] === "on" ? "✓" : "";
    console.log(`Set checkmark for '${id}' to '${el.textContent}'`);
  }

  function setText(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Element with ID '${id}' not found`);
      return;
    }
    el.textContent = data[id] || "";
    console.log(`Set text for '${id}' to '${el.textContent}'`);
  }

  // 3) Top Info Fields
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

  // 4) Now set each Pass/Fail/N/A/Remarks for all the systems & parts:
  //    BOOM ASSEMBLY (Telescoping Boom)
  // --------------------------------------------------------------
  // Telescoping Boom Sections
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

  // Boom Cylinder
  setCheckMark("piston_rod_pass");
  setCheckMark("piston_rod_fail");
  setCheckMark("piston_rod_na");
  setText("piston_rod_remarks");

  setCheckMark("cylinder_barrel_pass");
  setCheckMark("cylinder_barrel_fail");
  setCheckMark("cylinder_barrel_na");
  setText("cylinder_barrel_remarks");

  // Boom Head
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

  // Boom Base Section
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

  // Extension Jibs
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

  // Sheaves (General)
  setCheckMark("groove_lining_pass");
  setCheckMark("groove_lining_fail");
  setCheckMark("groove_lining_na");
  setText("groove_lining_remarks");

  setCheckMark("sheave_bearings_pass");
  setCheckMark("sheave_bearings_fail");
  setCheckMark("sheave_bearings_na");
  setText("sheave_bearings_remarks");

  // SUPERSTRUCTURE
  // --------------------------------------------------------------
  // Turntable
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

  // Operator’s Cab
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

  // Counterweights
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

  // Swing Mechanism
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

  // Winch Systems
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

  // Hydraulic Pumps
  setCheckMark("gear_pump_pass");
  setCheckMark("gear_pump_fail");
  setCheckMark("gear_pump_na");
  setText("gear_pump_remarks");

  setCheckMark("piston_pump_pass");
  setCheckMark("piston_pump_fail");
  setCheckMark("piston_pump_na");
  setText("piston_pump_remarks");


  // CARRIER (CHASSIS)
  // --------------------------------------------------------------
  // Truck Chassis
  setCheckMark("frame_rails_pass");
  setCheckMark("frame_rails_fail");
  setCheckMark("frame_rails_na");
  setText("frame_rails_remarks");

  setCheckMark("axles_pass");
  setCheckMark("axles_fail");
  setCheckMark("axles_na");
  setText("axles_remarks");

  // Outriggers
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


  // LOAD HANDLING EQUIPMENT
  // --------------------------------------------------------------
  // Load Hook
  setCheckMark("hook_safety_latch_pass");
  setCheckMark("hook_safety_latch_fail");
  setCheckMark("hook_safety_latch_na");
  setText("hook_safety_latch_remarks");

  setCheckMark("hook_swivel_mech_pass");
  setCheckMark("hook_swivel_mech_fail");
  setCheckMark("hook_swivel_mech_na");
  setText("hook_swivel_mech_remarks");

  // Load Line (Wire Rope)
  setCheckMark("wire_rope_core_pass");
  setCheckMark("wire_rope_core_fail");
  setCheckMark("wire_rope_core_na");
  setText("wire_rope_core_remarks");

  setCheckMark("wire_rope_strands_pass");
  setCheckMark("wire_rope_strands_fail");
  setCheckMark("wire_rope_strands_na");
  setText("wire_rope_strands_remarks");

  // Overhaul Ball
  setCheckMark("overhaul_ball_weight_pass");
  setCheckMark("overhaul_ball_weight_fail");
  setCheckMark("overhaul_ball_weight_na");
  setText("overhaul_ball_weight_remarks");

  setCheckMark("overhaul_ball_swivel_pass");
  setCheckMark("overhaul_ball_swivel_fail");
  setCheckMark("overhaul_ball_swivel_na");
  setText("overhaul_ball_swivel_remarks");

  // Rigging Hardware
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


  // HYDRAULIC SYSTEMS
  // --------------------------------------------------------------
  // Hydraulic Cylinders
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

  // Hydraulic Reservoir
  setCheckMark("tank_filters_pass");
  setCheckMark("tank_filters_fail");
  setCheckMark("tank_filters_na");
  setText("tank_filters_remarks");

  setCheckMark("sight_gauge_pass");
  setCheckMark("sight_gauge_fail");
  setCheckMark("sight_gauge_na");
  setText("sight_gauge_remarks");

  // Hydraulic Lines
  setCheckMark("hyd_lines_hoses_pass");
  setCheckMark("hyd_lines_hoses_fail");
  setCheckMark("hyd_lines_hoses_na");
  setText("hyd_lines_hoses_remarks");

  setCheckMark("hyd_lines_fittings_pass");
  setCheckMark("hyd_lines_fittings_fail");
  setCheckMark("hyd_lines_fittings_na");
  setText("hyd_lines_fittings_remarks");


  // SAFETY & MONITORING SYSTEMS
  // --------------------------------------------------------------
  // Load Moment Indicator (LMI)
  setCheckMark("lmi_sensors_pass");
  setCheckMark("lmi_sensors_fail");
  setCheckMark("lmi_sensors_na");
  setText("lmi_sensors_remarks");

  setCheckMark("lmi_display_pass");
  setCheckMark("lmi_display_fail");
  setCheckMark("lmi_display_na");
  setText("lmi_display_remarks");

  // Anti-Two-Block Device
  setCheckMark("anti_twoblock_switch_pass");
  setCheckMark("anti_twoblock_switch_fail");
  setCheckMark("anti_twoblock_switch_na");
  setText("anti_twoblock_switch_remarks");

  setCheckMark("anti_twoblock_alarm_pass");
  setCheckMark("anti_twoblock_alarm_fail");
  setCheckMark("anti_twoblock_alarm_na");
  setText("anti_twoblock_alarm_remarks");

  // Outrigger Pressure Sensors
  setCheckMark("outrigger_load_cells_pass");
  setCheckMark("outrigger_load_cells_fail");
  setCheckMark("outrigger_load_cells_na");
  setText("outrigger_load_cells_remarks");

  // Crane Level Indicator
  setCheckMark("crane_bubble_level_pass");
  setCheckMark("crane_bubble_level_fail");
  setCheckMark("crane_bubble_level_na");
  setText("crane_bubble_level_remarks");

  setCheckMark("crane_digital_level_pass");
  setCheckMark("crane_digital_level_fail");
  setCheckMark("crane_digital_level_na");
  setText("crane_digital_level_remarks");

  // Radius Indicator
  setCheckMark("radius_indicator_pass");
  setCheckMark("radius_indicator_fail");
  setCheckMark("radius_indicator_na");
  setText("radius_indicator_remarks");


  // ADDITIONAL ATTACHMENTS
  // --------------------------------------------------------------
  // Fly Jib
  setCheckMark("fly_jib_pivot_pass");
  setCheckMark("fly_jib_pivot_fail");
  setCheckMark("fly_jib_pivot_na");
  setText("fly_jib_pivot_remarks");

  setCheckMark("fly_jib_extension_pins_pass");
  setCheckMark("fly_jib_extension_pins_fail");
  setCheckMark("fly_jib_extension_pins_na");
  setText("fly_jib_extension_pins_remarks");

  // Lattice Extensions
  setCheckMark("lattice_bracing_pass");
  setCheckMark("lattice_bracing_fail");
  setCheckMark("lattice_bracing_na");
  setText("lattice_bracing_remarks");

  setCheckMark("lattice_connectors_pass");
  setCheckMark("lattice_connectors_fail");
  setCheckMark("lattice_connectors_na");
  setText("lattice_connectors_remarks");

  // Man Basket
  setCheckMark("man_basket_fall_protection_pass");
  setCheckMark("man_basket_fall_protection_fail");
  setCheckMark("man_basket_fall_protection_na");
  setText("man_basket_fall_protection_remarks");

  setCheckMark("man_basket_railings_pass");
  setCheckMark("man_basket_railings_fail");
  setCheckMark("man_basket_railings_na");
  setText("man_basket_railings_remarks");


// 5) Signature & Emails
setText("signature");
setText("email1");
setText("email2");

// 6) Print button
const printBtn = document.getElementById("printBtn");
if (printBtn) {
  printBtn.addEventListener("click", () => {
    window.print();
  });
}

// 7) Save (Download) button to save JSON locally
const saveLocalBtn = document.getElementById("saveLocalBtn");
if (saveLocalBtn) {
  saveLocalBtn.addEventListener("click", () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    // Optional: Use the inspection date in the file name if available
    link.download = `telescoping_inspection_${data.inspectionDate || "data"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

// 8) Insert any photos into the Deficiencies/Hazards page
//    We look for any keys ending in "_dataURL"
const photosContainer = document.getElementById("photosContainer");
if (photosContainer) {
  for (const key in data) {
    if (key.endsWith("_dataURL")) {
      const base64Image = data[key];
      if (base64Image) {
        console.log(`Processing photo for key: ${key}`);
        const imgEl = document.createElement("img");
        imgEl.src = base64Image;
        imgEl.alt = key;
        imgEl.style.maxWidth = "200px";
        photosContainer.appendChild(imgEl);
        console.log(`Photo added for ${key}`);
      } else {
        console.warn(`No Base64 data for ${key}`);
      }
    }
  }
}
});


