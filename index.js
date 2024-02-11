"use_strict";
let panjang = Number(prompt("Panjang kotak")) || 9;
let lebar = Number(prompt("Lebar Kotak")) || 9;
let jumlahBom = Number(prompt("Jumlah Bom")) || 15;
let remainingTiles = panjang * lebar;
let gameState = true;
let tileNumber = 0;
let numberOfTurn = 0;
let timerCounter = 0;
let timerIsOn = false;
const timerDom = document.getElementById("timer");
const minSecond = document.getElementById("min-2");
const minFirst = document.getElementById("min-1");
const secSecond = document.getElementById("sec-2");
const secFirst = document.getElementById("sec-1");
document.getElementById("reset-btn").addEventListener("click", reset);

const convertNumber = function (number) {
  let result = number < 10 ? `0${number}` : number;
  return result;
};
const convertSecMin = function (number) {
  return `${convertNumber(Math.floor(number / 60))}${convertNumber(
    number % 60
  )}`;
};
const turnOnTimer = function () {
  timerIsOn = true;
  trigger();
};

const trigger = function () {
  timerCounter === 3600 ? (timerCounter = 0) : timerCounter;
  const timerInterval = setInterval(() => {
    if (timerIsOn === false) {
      timerCounter = 0;

      return clearInterval(timerInterval);
    }
    ++timerCounter;
    let timerNow = convertSecMin(timerCounter);
    minSecond.textContent = timerNow.slice(0, 1);
    minFirst.textContent = timerNow.slice(1, 2);
    secSecond.textContent = timerNow.slice(2, 3);
    secFirst.textContent = timerNow.slice(3, 4);
  }, 1000);
};

/**
 * Membuat lokasi bomb yang unik sesuai jumlah yang ditentukan dalam format array panjangxlebar
 * @param {number} number
 * @param {number} xMatrix
 * @param {number} yMatrix
 * @param {callback function} callback
 * @returns {array}
 *
 * contoh array hasil:
 * [
 * ["💣","💣","O","💣","O","O"],
 * ["O","💣","O","💣","O","O"],
 * ["O","💣","O","💣","O","O"],
 * ["O","O","O","💣","O","O"],
 * ["💣","💣","O","💣","O","💣"],
 * ["O","💣","O","💣","O","O"],
 * ["💣","💣","💣","💣","O","O"],
 * ["O","💣","O","💣","O","O"],
 * ["💣","O","O","💣","O","O"]
 * ]
 *
 */
function generateLocation(number, xMatrix, yMatrix, callback) {
  try {
    if (number >= xMatrix * yMatrix)
      throw new Error("Jumlah bomb harus lebih kecil dari jumlah kotak");
  } catch (error) {
    alert(error.message);
  }
  let uniqueBombLocations = new Set();
  let location = [];
  while (uniqueBombLocations.size < number) {
    const i = Math.floor(Math.random() * xMatrix);
    const j = Math.floor(Math.random() * yMatrix);
    uniqueBombLocations.add(i + "+" + j);
  }
  for (let i = 0; i < xMatrix; i++) {
    location[i] = [];
    for (let j = 0; j < yMatrix; j++) {
      location[i][j] = uniqueBombLocations.has(`${i}+${j}`) ? "💣" : "O";
    }
  }

  return callback(location);
}
/**
 * membuat jarak lantai aman ke lantai yang berisi bom
 * @param {array} location
 * @returns {array}
 *
 * contoh array hasil:
 * [
 * ["💣","💣","4","💣","2"," "],
 * ["1","💣","6","💣","3"," "],
 * ["2","💣","5","💣","3"," "],
 * ["2","3","4","💣","4","1"],
 * ["💣","💣","4","💣","3","💣"],
 * ["3","💣","6","💣","3","1"],
 * ["💣","💣","💣","💣","3"," "],
 * ["3","💣","5","💣","3"," "],
 * ["💣","2","3","💣","2"," "]
 * ]
 */
function generateDistance(location) {
  let completeMap = [];
  for (let i = 0; i < location.length; i++) {
    completeMap[i] = [];
    for (let j = 0; j < location[i].length; j++) {
      let bombs = 0;
      if (i == 0 && j == 0) {
        for (let contain of [location[1][0], location[1][1], location[0][1]]) {
          contain == "💣" && bombs++;
        }
      } else if (i == 0 && j == location[i].length - 1) {
        for (let contain of [
          location[i][location[i].length - 2],
          location[1][location[i].length - 1],
          location[1][location[i].length - 2],
        ]) {
          contain == "💣" && bombs++;
        }
      } else if (i == location.length - 1 && j == 0) {
        for (let contain of [
          location[location.length - 2][0],
          location[location.length - 2][1],
          location[location.length - 1][1],
        ]) {
          contain == "💣" && bombs++;
        }
      } else if (i == location.length - 1 && j == location[i].length - 1) {
        for (let contain of [
          location[location.length - 1][location[i].length - 2],
          location[location.length - 2][location[i].length - 1],
          location[location.length - 2][location[i].length - 2],
        ]) {
          contain == "💣" && bombs++;
        }
      } else if (i == 0) {
        for (let contain of [
          location[i][j - 1],
          location[i][j + 1],
          location[i + 1][j + 1],
          location[i + 1][j],
          location[i + 1][j - 1],
        ]) {
          contain == "💣" && bombs++;
        }
      } else if (i == location.length - 1) {
        for (let contain of [
          location[location.length - 1][j - 1],
          location[location.length - 1][j + 1],
          location[location.length - 2][j + 1],
          location[location.length - 2][j],
          location[location.length - 2][j - 1],
        ]) {
          contain == "💣" && bombs++;
        }
      } else if (j == 0) {
        for (let contain of [
          location[i - 1][0],
          location[i - 1][1],
          location[i][1],
          location[i + 1][0],
          location[i + 1][1],
        ]) {
          contain == "💣" && bombs++;
        }
      } else if (j == location[i].length - 1) {
        for (let contain of [
          location[i - 1][location[i].length - 2],
          location[i - 1][location[i].length - 1],
          location[i][location[i].length - 2],
          location[i + 1][location[i].length - 2],
          location[i + 1][location[i].length - 1],
        ]) {
          contain == "💣" && bombs++;
        }
      } else {
        for (let contain of [
          location[i - 1][j - 1],
          location[i - 1][j],
          location[i - 1][j + 1],
          location[i][j - 1],
          location[i][j + 1],
          location[i + 1][j - 1],
          location[i + 1][j],
          location[i + 1][j + 1],
        ]) {
          contain == "💣" && bombs++;
        }
      }
      bombs = bombs === 0 ? " " : bombs;
      completeMap[i][j] = location[i][j] == "💣" ? "💣" : bombs;
    }
  }

  return completeMap;
}

/**
 * membuat element lantai/tile di section game sesuai array yang berisi posisi lengkap lantai/tile
 * @param {array} completeMap
 */
function generateTiles(completeMap) {
  const table = document.getElementById("tiles");
  completeMap.forEach((row) => {
    let rowElm = document.createElement("tr");
    row.forEach((tile) => {
      let tileElm = document.createElement("td");
      let tileElmBuffer = document.createElement("div");
      let coverElm = document.createElement("span");
      let hideElm = document.createElement("span");
      tileElmBuffer.textContent = tile;
      tileElmBuffer.setAttribute("class", "tile");
      tileElmBuffer.setAttribute("id", `tile-${tileNumber}`);
      hideElm.setAttribute("class", "hide");
      hideElm.setAttribute("id", `hide-${tileNumber}`);
      coverElm.setAttribute("class", "cover-tile");
      coverElm.setAttribute("id", `cover-${tileNumber}`);
      tileElm.appendChild(tileElmBuffer);
      tileElm.appendChild(hideElm);
      tileElmBuffer.appendChild(coverElm);
      rowElm.appendChild(tileElm);
      tileNumber++;
    });
    table.appendChild(rowElm);
  });
}

/**
 * menambahkan event listener pada setiap tile/lantai yang telah dibuat
 */
function createTiles() {
  for (let tileIndex = 0; tileIndex < tileNumber; tileIndex++) {
    document
      .getElementById(`cover-${tileIndex}`)
      .addEventListener("mousedown", () => {
        if (gameState === false) {
          document
            .getElementById(`cover-${tileIndex}`)
            .setAttribute("style", "display:inline-block");
          return;
        }
        document
          .getElementById(`cover-${tileIndex}`)
          .setAttribute("style", "display:none");
      });
    document
      .getElementById(`hide-${tileIndex}`)
      .addEventListener("mouseup", () => {
        --remainingTiles;
        if (gameState === false) {
          document
            .getElementById(`cover-${tileIndex}`)
            .setAttribute("style", "display:inline-block");
          return;
        }
        if (numberOfTurn === 0 && timerCounter <= 1) turnOnTimer();
        document
          .getElementById(`hide-${tileIndex}`)
          .setAttribute("style", "display:none");
        const tileValue = document.getElementById(
          `tile-${tileIndex}`
        ).textContent;
        if (tileValue === "💣") {
          gameState = false;
          timerIsOn = false;
          document.getElementById("reset-btn").textContent = "😱";
          return;
        }
        if (remainingTiles === jumlahBom) {
          gameState = false;
          timerIsOn = false;
          document.getElementById("reset-btn").textContent = "🥳";
        }
        ++numberOfTurn;
      });
  }
  document.querySelector("main").setAttribute("style", "opacity:100%;");
}

/**
 * callback function untuk tombol reset
 */
function reset() {
  let tileContainer = document.querySelector(".tiles-container");
  let newTable = document.createElement("table");
  timerIsOn = false;
  gameState = true;
  tileNumber = 0;
  remainingTiles = panjang * lebar;
  minSecond.textContent = 0;
  minFirst.textContent = 0;
  secSecond.textContent = 0;
  secFirst.textContent = 0;

  numberOfTurn = 0;
  document.getElementById("reset-btn").textContent = "😄";
  document.getElementById("tiles").remove();
  newTable.setAttribute("id", "tiles");
  tileContainer.appendChild(newTable);
  generateTiles(generateLocation(jumlahBom, panjang, lebar, generateDistance));
  createTiles();
}
generateTiles(generateLocation(jumlahBom, panjang, lebar, generateDistance));
createTiles();
document.getElementById("input").set;
