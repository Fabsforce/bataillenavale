// File to test safe zone formulas (vertically mostly as it is more challenging to visualize)

// Config variables
//const MATRIX_LENGTH = 10;
const row = 1;
const col = 1;
const vesselLength = 3;

/*
// Function to place the boats on virtual matrix
*/
function placeBoats(vessels, listCoordVessels = [], listForbiddenCoord = []) {
  const direction = Number.parseInt(Math.random() * Math.floor(2)); // Direction : 0 -> horizontally / 1 : vertically
  const randomColStart = Number.parseInt(Math.random() * Math.floor(MATRIX_LENGTH) + 1);
  const randomRowStart = Number.parseInt(Math.random() * Math.floor(MATRIX_LENGTH) + 1);

  const vesselLength = parseInt(vessels.entries().next().value[1]);
  const vesselName = vessels.entries().next().value[0];

  console.log(vesselName);

  // Check if the coordinates is in the forbidden list
  let validZone = validateZone(vesselLength, randomRowStart, randomColStart, listForbiddenCoord, listCoordVessels);

  // Place boats horizontally
  if (direction === 0 && validZone && vesselLength + randomColStart <= MATRIX_LENGTH) {
    for (let i = 0; i < vesselLength; i++) {
      // Add the coordinates of the boat
      listCoordVessels.push(randomRowStart + "" + parseInt(randomColStart + i));
      // Interdire les coord des lignes en-dessous et au-dessus du bateau
      listForbiddenCoord.push(parseInt(randomRowStart - 1) + "" + parseInt(randomColStart + i));
      listForbiddenCoord.push(parseInt(randomRowStart + 1) + "" + parseInt(randomColStart + i));
    }
    // Forbid the cell before and after the boat
    listForbiddenCoord.push(randomRowStart + "" + parseInt(randomColStart - 1));
    listForbiddenCoord.push(randomRowStart + "" + parseInt(randomColStart + vesselLength));
    vessels.delete(vesselName);
  }
  // Place boats vertically
  if (direction === 1 && validZone && vesselLength + randomRowStart <= MATRIX_LENGTH) {
    for (let i = 0; i < vesselLength; i++) {
      // Add the coordinates of the boat
      listCoordVessels.push(parseInt(randomRowStart + i) + "" + randomColStart);
      // Interdire les coord des lignes en-dessous et au-dessus du bateau
      listForbiddenCoord.push(parseInt(randomRowStart + i) + "" + parseInt(randomColStart - 1));
      listForbiddenCoord.push(parseInt(randomRowStart + i) + "" + parseInt(randomColStart + 1));
    }
    // Forbid the cell below and above the boat
    listForbiddenCoord.push(parseInt(randomRowStart - 1) + "" + randomColStart);
    listForbiddenCoord.push(parseInt(randomRowStart + vesselLength) + "" + randomColStart);
    vessels.delete(vesselName);
  }

  //console.log(listCoordVessels);
  //console.log(listForbiddenCoord);

  // Recurse : we >call the function again until there's no more vessel to place
  if (vessels.size > 0) return placeBoats(vessels, listCoordVessels, listForbiddenCoord);

  // We return the coordinates of all boats
  return listCoordVessels;
}

/*
// Function to valide a zone to place the boat
*/
function validateZone(vesselLength, randomRowStart, randomColStart, listForbiddenCoord, listCoordVessels) {
  for (let i = 0; i < vesselLength; i++) {
    if (
      listForbiddenCoord.concat(listCoordVessels).includes(randomRowStart + "" + parseInt(randomColStart + i)) ||
      listForbiddenCoord.concat(listCoordVessels).includes(parseInt(randomRowStart + i) + "" + randomColStart)
    )
      return false;
  }

  return true;
}

//
// Place boats on virtual matrix for computer play
// I use a Map to be sure the vessels will be placed in this order
//
const listVessels = placeBoats(
  new Map([
    ["porteAvion", 5],
    ["sousMarinNucleaire", 7],
    ["croiseur", 4],
    ["contreTorpilleur_UN", 3],
    ["contreTorpilleur_DEUX", 3],
    ["torpilleur", 1],
  ])
);

//
// Visually debug the computer battlesship matrix
//
let debug2 = document.getElementsByClassName("matrixDebug2");
for (let x = 1; x <= MATRIX_LENGTH; x++) {
  const tr = document.createElement("tr");
  for (let y = 1; y <= MATRIX_LENGTH; y++) {
    const td = document.createElement("td");
    td.innerHTML += listVessels.includes(x + "" + y) ? "<span style='color:red'>" + 1 + "</span>" : 0;
    tr.appendChild(td);
  }
  debug2[0].appendChild(tr);
}
