// Config variables
const MATRIX_LENGTH = 10;

// State of the app
let state = {
  dashboard: {
    shots: 0,
    hits: 0,
    sea: 0,
  },
  userShotsTaken: [],
};

// Create a visual user matrix
const userMatrix = domMatrix();
document.getElementsByClassName("userMatrix")[0].appendChild(userMatrix);

// Start the boats placement on virtual matrix for computer play
// I use a Map to be sure the vessels will be placed in this order
const listVessels = computerMatrix(
  new Map([
    ["aircraftCarrier", 5 /*+ MATRIX_LENGTH*/],
    ["nuclearSubmarine", 7 /*+ MATRIX_LENGTH*/],
    ["cruiser", 4 /*+ MATRIX_LENGTH*/],
    ["destroyer_ONE", 3 /*+ MATRIX_LENGTH*/],
    ["destroyer_TWO", 3 /*+ MATRIX_LENGTH*/],
    ["torpedo", 1 /*+ MATRIX_LENGTH*/],
  ])
);

// DEBUG DEBUG DEBUG
/*let debug2 = document.getElementsByClassName("matrixDebug");
// create a dom table to update
for (let x = 1; x <= MATRIX_LENGTH; x++) {
  const tr = document.createElement("tr");
  for (let y = 1; y <= MATRIX_LENGTH; y++) {
    const td = document.createElement("td");
    td.innerHTML += listVessels.includes(x + "" + y) ? "<span style='color:red'>" + 1 + "</span>" : 0;
    tr.appendChild(td);
  }
  debug2[0].appendChild(tr);
}
*/

// Function that builds and returns a matrix DOM element
function domMatrix() {
  //const visualMatrix = document.getElementsByClassName(domElement);
  let domMatrix = document.createElement("table");
  for (let x = 1; x <= MATRIX_LENGTH; x++) {
    const tr = document.createElement("tr");
    tr.setAttribute("id", x);
    for (let y = 1; y <= MATRIX_LENGTH; y++) {
      const td = document.createElement("td");
      td.setAttribute("id", x + "-" + y);
      td.addEventListener("click", (evt) => onClickFire(evt, domMatrix));
      tr.appendChild(td);
    }
    domMatrix.appendChild(tr);
  }
  return domMatrix;
}

// Get the coordinates of the clicked cell
function onClickFire(evt, matrix) {
  const coordinates = evt.target.id.split("-");
  const row = coordinates[0],
    col = coordinates[1];
  if (state.userShotsTaken.includes(row + "" + col)) {
    return false; // or an alert message saying that this shot was already taken
  }
  if (listVessels.includes(row + "" + col)) {
    document.getElementById(evt.target.id).innerHTML = "X";
    state.dashboard.hits = state.dashboard.hits + 1;
  } else {
    document.getElementById(evt.target.id).innerHTML = "O";
    state.dashboard.sea = state.dashboard.sea + 1;
  }
  // Update the state
  state.dashboard.shots = state.dashboard.shots + 1;
  state.userShotsTaken = [...state.userShotsTaken, row + "" + col];
  // Update the dom
  document.getElementsByClassName("shots")[0].innerHTML = state.dashboard.shots;
  document.getElementsByClassName("hits")[0].innerHTML = state.dashboard.hits;
  document.getElementsByClassName("sea")[0].innerHTML = state.dashboard.sea;
  console.log(state);
}

//  Returns the boats places on a virtual matrix
function computerMatrix(vessels, listCoordVessels = [], listForbiddenCoord = []) {
  // Variables to randomly place boats
  const direction = Number.parseInt(Math.random() * Math.floor(2)); // Direction : 0 -> horizontally / 1 : vertically
  const randomColStart = Number.parseInt(Math.random() * Math.floor(MATRIX_LENGTH) + 1);
  const randomRowStart = Number.parseInt(Math.random() * Math.floor(MATRIX_LENGTH) + 1);
  const vesselLength = parseInt(vessels.entries().next().value[1]);

  // Check if the coordinates is in the forbidden list
  let validZone = validateZone(vesselLength, randomRowStart, randomColStart, listForbiddenCoord, listCoordVessels);

  // Places boat
  let boastPlaced = { vessels, listForbiddenCoord, listCoordVessels };
  if (validZone) {
    boastPlaced = placeBoats(vessels, direction, randomRowStart, randomColStart, listForbiddenCoord, listCoordVessels);
  }

  // Recurse : we >call the function again until there's no more vessel to place
  if (vessels.size > 0) return computerMatrix(boastPlaced.vessels, boastPlaced.listCoordVessels, boastPlaced.listForbiddenCoord);

  // We return the coordinates of all boats
  return listCoordVessels;
}

// Function to valide a zone to place the boat
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

// Function to places the vessels
function placeBoats(vessels, direction, randomRowStart, randomColStart, listForbiddenCoord, listCoordVessels) {
  //  Get Vessels Info
  const vesselLength = parseInt(vessels.entries().next().value[1]);
  const vesselName = vessels.entries().next().value[0];

  // Place boats horizontally
  if (direction === 0 && vesselLength + randomColStart <= MATRIX_LENGTH) {
    for (let i = 0; i < vesselLength; i++) {
      listCoordVessels.push(randomRowStart + "" + parseInt(randomColStart + i)); // save coordinates of boat
      listForbiddenCoord.push(parseInt(randomRowStart - 1) + "" + parseInt(randomColStart + i)); // forbid left to the boat
      listForbiddenCoord.push(parseInt(randomRowStart + 1) + "" + parseInt(randomColStart + i)); // forbid right to the boat
    }
    listForbiddenCoord.push(randomRowStart + "" + parseInt(randomColStart - 1)); // forbid below boat
    listForbiddenCoord.push(randomRowStart + "" + parseInt(randomColStart + vesselLength)); // forbid above boat
    vessels.delete(vesselName);
  }

  // Place boats vertically
  if (direction === 1 && vesselLength + randomRowStart <= MATRIX_LENGTH) {
    for (let i = 0; i < vesselLength; i++) {
      listCoordVessels.push(parseInt(randomRowStart + i) + "" + randomColStart); // save coordinates of boat
      listForbiddenCoord.push(parseInt(randomRowStart + i) + "" + parseInt(randomColStart - 1)); // forbid left to the boat
      listForbiddenCoord.push(parseInt(randomRowStart + i) + "" + parseInt(randomColStart + 1)); // forbid right to the boat
    }
    listForbiddenCoord.push(parseInt(randomRowStart - 1) + "" + randomColStart); // forbid below boat
    listForbiddenCoord.push(parseInt(randomRowStart + vesselLength) + "" + randomColStart); // forbid above boat
    vessels.delete(vesselName);
  }
  return { vessels, listForbiddenCoord, listCoordVessels };
}
