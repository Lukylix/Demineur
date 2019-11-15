function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/*
#######################
 Positon finding
#######################
*/
function getCursorPosition(canvas, event) {
  /*Recupérer la position actuelle du canva dans un objet*/
  const rect = canvas.getBoundingClientRect();
  /*Transformer pour obtenir un position relative au canva*/
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
}
function getGamePosition(x, y) {
  const idx = Math.floor(x / game.cube.width);
  const idy = Math.floor(y / game.cube.height);
  console.log(`Click on ${idx}:${idy}`);
  return [idx, idy];
}
function middlePosFromIndex(idx, idy) {
  const posx = idx * game.cube.width + game.cube.width / 2;
  const posy = idy * game.cube.height + game.cube.height / 2;
  return [posx, posy];
}

function clickExpand(idx, idy) {
  //Make sur the function is used as intended
  //Since we will increment the value of the case to prevente infinite recursion
  if (game.states[idy][idx] == 0) {
    game.states[idy][idx] += 10;
    if (idx - 1 >= 0) {
      if (game.states[idy][idx - 1] === 0) {
        clickExpand(idx - 1, idy);
      }
    }
    if (idx + 1 < game.colmun) {
      if (game.states[idy][idx + 1] === 0) {
        clickExpand(idx + 1, idy);
      }
    }
    if (idy - 1 >= 0) {
      if (game.states[idy - 1][idx] === 0) {
        clickExpand(idx, idy - 1);
      }
    }
    if (idy + 1 < game.row) {
      if (game.states[idy + 1][idx] === 0) {
        clickExpand(idx, idy + 1);
      }
    }
  }
}
function clickExpandShowAround() {
  for (x = 0; x < game.colmun; x++) {
    for (y = 0; y < game.row; y++) {
      if (game.states[y][x] == 10) {
        for (
          currentX = x - 1 >= 0 ? x - 1 : x;
          currentX <= (x + 1 < game.colmun ? x + 1 : x);
          currentX++
        ) {
          for (
            currentY = y - 1 >= 0 ? y - 1 : y;
            currentY <= (y + 1 < game.row ? y + 1 : y);
            currentY++
          ) {
            if (
              game.states[currentY][currentX] < 9 &&
              game.states[currentY][currentX] != 0
            ) {
              game.states[currentY][currentX] += 10;
            }
          }
        }
      }
    }
  }
}
/*
################################
            Drawing
################################
*/
function drawCaseAll(showAll = false) {
  for (x = 0; x < game.colmun; x++) {
    for (y = 0; y < game.row; y++) {
      drawCase(x, y, showAll);
    }
  }
}
function drawGridPoint() {
  game.ctx.fillStyle = game.color.line;
  for (axis = 0; axis < 2; axis++) {
    for (x = 0; x < (axis == 0 ? game.colmun : game.row) - 1; x++) {
      game.ctx.beginPath();
      game.ctx.arc(
        axis == 0 ? (x + 1) * game.cube.width : game.spacing * 1.5,
        axis == 0 ? game.spacing * 1.5 : (x + 1) * game.cube.height,
        game.spacing / 2,
        0,
        2 * Math.PI
      );
      game.ctx.arc(
        axis == 0
          ? (x + 1) * game.cube.width
          : game.bounding.width - game.spacing * 1.5,
        axis == 0
          ? game.bounding.height - game.spacing * 1.5
          : (x + 1) * game.cube.height,
        game.spacing / 2,
        0,
        2 * Math.PI
      );
      game.ctx.fill();
    }
  }
}
function drawGridNew() {
  game.ctx.fillStyle = game.color.line;
  for (x = 0; x < game.colmun - 1; x++) {
    game.ctx.fillRect(
      (x + 1) * game.cube.width - game.spacing * 0.5,
      game.spacing * 1.5,
      game.spacing,
      game.bounding.height - game.spacing * 3
    );
  }
  for (y = 0; y < game.row - 1; y++) {
    game.ctx.fillRect(
      game.spacing * 1.5,
      (y + 1) * game.cube.height - game.spacing * 0.5,
      game.bounding.width - game.spacing * 3,
      game.spacing
    );
  }
  drawGridPoint();
}
function fontSelect(style, color, resize = 100, bypassSize) {
  game.ctx.fillStyle = color;
  return `${style == "regular" ? 400 : 900} ${
    bypassSize == undefined
      ? ((game.cube.height < game.cube.width
          ? game.cube.height
          : game.cube.width) -
          game.spacing) *
        (resize / 100)
      : bypassSize
  }px "Font Awesome 5 Free"`;
}

//css-tricks.com/converting-color-spaces-in-javascript/
function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  return "#" + r + g + b;
}
function colorHeatSelect(val, min = 0, max = 8) {
  val = val / (max - min);
  let h = (1 - val) * 240;
  return HSLToHex(h, 100, 40);
}
function drawCaseBackground(idx, idy, color = "#4D4D4D") {
  game.ctx.fillStyle = color;
  game.ctx.fillRect(
    idx * game.cube.width + game.spacing / 2,
    idy * game.cube.height + game.spacing / 2,
    game.cube.width - game.spacing,
    game.cube.height - game.spacing
  );
}
function drawCase(idx, idy, showAll = false) {
  pos = middlePosFromIndex(idx, idy); // return x then y
  if (game.states[idy][idx] >= 10) {
    if (game.states[idy][idx] < 20) {
      drawCaseBackground(idx, idy);
      if (game.states[idy][idx] == 19) {
        game.ctx.font = fontSelect("solid", game.color.explode, 160);
        game.ctx.fillText(game.icons.explode, pos[0], pos[1]);
        game.ctx.font = fontSelect("solid", "#ffffff", 90);
        game.ctx.fillText(game.icons.bomb, pos[0], pos[1]);
        console.log("Bomb explode");
      } else {
        if (game.states[idy][idx] > 10) {
          game.ctx.font = fontSelect(
            "regular",
            colorHeatSelect(game.states[idy][idx] % 10)
          );
          game.ctx.fillText(game.states[idy][idx] % 10, pos[0], pos[1]);
        }
      }
    } else {
      if (showAll && game.states[idy][idx] == 29) {
        game.ctx.font = fontSelect("solid", game.color.bomb, 85);
        game.ctx.fillText(game.icons.bomb, pos[0], pos[1]);
      }
      game.ctx.font = fontSelect("solid", game.color.flag, 80);
      game.ctx.fillText(game.icons.flag, pos[0], pos[1]);
      console.log("Flag");
    }
  } else if (showAll && game.states[idy][idx] == 9) {
    game.ctx.font = fontSelect("solid", game.color.bomb, 85);
    game.ctx.fillText(game.icons.bomb, pos[0], pos[1]);
  }
}
/*
##############
 Win checking
##############
*/

/*
###################################
 Game object inialisation and reset
###################################
*/
function generateEmptyTab() {
  for (s = 0; s < game.row; s++) {
    game.states.push([]);
  }
}
function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function populateMines(nbMines) {
  for (x = 0; x < nbMines; x++) {
    while (true) {
      let idx = randomNumberBetween(0, game.colmun - 1);
      let idy = randomNumberBetween(0, game.row - 1);
      if (game.states[idy][idx] == undefined) {
        game.states[idy][idx] = 9; //code for undiscovered Bomb
        break;
      }
    }
  }
}
function calcProximity() {
  for (idx = 0; idx < game.colmun; idx++) {
    for (idy = 0; idy < game.row; idy++) {
      if (game.states[idy][idx] == undefined) {
        let startX = idx - 1 > 0 ? idx - 1 : 0;
        let endX = idx + 1 < game.colmun ? idx + 1 : game.colmun - 1;
        let startY = idy - 1 > 0 ? idy - 1 : 0;
        let endY = idy + 1 < game.row ? idy + 1 : game.row - 1;
        game.states[idy][idx] = 0;
        for (x = startX; x <= endX; x++) {
          for (y = startY; y <= endY; y++) {
            if (game.states[y][x] == 9) {
              game.states[idy][idx]++;
            }
          }
        }
      }
    }
  }
}
function calcGame() {
  game.canvas = document.querySelector("canvas");

  /*A bit messy but working */
  game.canvas.width = 900 * (game.colmun / game.row);
  game.canvas.height = 900;
  if (
    game.canvas.width >
    document.getElementById("body").getBoundingClientRect().width * 0.9
  ) {
    game.canvas.width =
      document.getElementById("body").getBoundingClientRect().width * 0.9;
    game.canvas.height = game.canvas.width * (game.row / game.colmun);
  } else if (game.canvas.width < 600) {
    game.canvas.width = 600;
    game.canvas.height = game.canvas.width * (game.row / game.colmun);
  }

  game.bounding = game.canvas.getBoundingClientRect();
  game.ctx = game.canvas.getContext("2d");
  /*game initial setup*/
  game.cube.height = game.bounding.height / game.row;
  game.cube.width = game.bounding.width / game.colmun;
  /*Dynamic spacing*/
  game.spacing = game.cube.height * 0.12;
  game.ctx.textBaseline = "middle";
  game.ctx.textAlign = "center";
  game.states = [];
  generateEmptyTab();
  populateMines(game.mines);
  calcProximity();
  console.log(game.states);
}
/*
#######################
All onclick function
#######################
*/
function resetGame() {
  game.ctx.clearRect(0, 0, game.bounding.width, game.bounding.height);
  drawGridNew();
  game.states = [];
  generateEmptyTab();
  game.ended = false;
  console.log("start population");
  populateMines(game.mines);
  console.log("start proximity");
  calcProximity();
}
function hideMenu() {
  $("div.setting").toggleClass("hide-setting");
  $("#menu-btn").toggleClass("disable-btn");
}
function updateSettings() {
  game.colmun = parseInt($("#col").val());
  game.row = parseInt($("#row").val());
  game.mines = parseInt($("#mines").val());
  console.log("starting reset");
  
  console.log("calc game");
  calcGame();
  console.log("starting reset");
  
  resetGame();
  console.log("Update done");
}
function updateSquare() {
  $("#row").toggleClass("d-none");
  $("#row")
    .prev()
    .toggleClass("d-none");
  $("#row").val($("#col").val());
  if ($("#square:checked").val() == "on") {
    $("#col")
      .prev()
      .html("Lines :");
  } else {
    $("#col")
      .prev()
      .html("Column :");
  }
  updateSettings();
}

/*
###############################
 Starting main program
###############################
*/

const game = {
  colmun: 30, // Can be custom
  row: 20, // Can be custom
  spacing: 20, // Can be custom erased by calcGame()
  mines: 80,
  flag: this.mines,
  cube: {},
  states: [],
  ended: false,
  icons: {
    bomb: "\uf1e2",
    flag: "\uf024",
    explode: "\uf666"
  },
  color: {
    line: "#242424",
    bomb: "#FF4646",
    flag: "#18BC9C",
    explode: "#EE7712"
  }
};
calcGame();
//drawGrid(game);
drawGridNew();
$("#col").val(game.colmun);
$("#row").val(game.row);
$("#mines").val(game.mines);
$("canvas").contextmenu(function(e) {
  e.preventDefault();
  e.stopPropagation();
});
/*
###############################
 Starting game
###############################
*/

$("canvas").mousedown(async function(event) {
  if (!game.ended) {
    let click = getCursorPosition(game.canvas, event);
    click = getGamePosition(click[0], click[1]);
    let clickSide = 0;
    switch (event.which) {
      case 1:
        console.log("Click gauche");
        clickSide = 1;
        break;
      case 3:
        console.log("Click droit");
        clickSide = 2;
        break;
      default:
        console.log("You have a strange Mouse!");
    }
    if (game.states[click[1]][click[0]] < 10) {
      if (clickSide == 1) {
        if (game.states[click[1]][click[0]] == 9) {
          game.ended = true;
          //Show all bombs and elements
          $(".message").text("Perdu !");
          $(".message").css("color", game.color.bomb);
          game.states[click[1]][click[0]] += 10;
          drawCaseAll(true);
        } else if (game.states[click[1]][click[0]] == 0) {
          clickExpand(click[0], click[1]);
          clickExpandShowAround();
          drawCaseAll();
        } else {
          game.states[click[1]][click[0]] += 10;
        }
      } else if (clickSide == 2) {
        game.states[click[1]][click[0]] += 20;
      }
    } else if (game.states[click[1]][click[0]] >= 20 && clickSide == 2) {
      game.states[click[1]][click[0]] -= 20;
      drawCaseBackground(
        click[0],
        click[1],
        $("canvas").css("background-color")
      );
    }
    drawCase(click[0], click[1]);
  }
});
