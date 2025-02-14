document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.inspection-item');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      // Grab the equipment type from data-equipment attribute
      const equipmentType = item.getAttribute('data-equipment');
      
      // Switch or if-else to decide which page to open
      switch (equipmentType) {
        case 'telescoping':
          window.location.href = 'checklists/telescopingcrane/telescopingcrane.html';
          break;
        case 'lattice':
          window.location.href = 'checklists/latticecrane/latticecrane.html';
          break;
        case 'tower':
          window.location.href = 'checklists/towercrane/towercrane.html';
          break;
        case 'boomtruck':
          window.location.href = 'checklists/boomtruck/boomtruck.html';
          break;
        default:
          alert('No matching page found for ' + equipmentType);
      }
    });
  });
});
