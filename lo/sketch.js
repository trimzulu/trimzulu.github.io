let shape_size = 90;
let margin_size = shape_size / 6;

let button_width = shape_size * 5 / 2 - margin_size;
let button_height = shape_size / 2;
let text_size = shape_size / 4;

let moveCount = 0;
let flag_Won = 0;

let board = [];
let init_board = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0
  ];

function setup() {
  createCanvas(shape_size * 5 + 2 * margin_size,
               shape_size * 5 + 4 * margin_size + text_size + button_height);
  background(220);

  randomBoard();
  
  drawButtons();
}

function draw() {  
  background(220);
  
  for (let i = 0; i < board.length; i++) {
    drawPiece(i);
  }
  
  drawButtons();
  drawScoreboard();
  
  if (flag_Won) {
    drawWinBanner();
  }
}

function drawWinBanner() {
  strokeWeight(4);
  stroke(0);
  fill(220);
  rect(margin_size + shape_size / 2, margin_size + shape_size * 1.5, shape_size * 4, shape_size * 2);
  
  textSize(text_size);
  strokeWeight(0);
  fill(0);
  
  let congrat_msg = 'Congratulations! ';
  if (moveCount < 12) {
    congrat_msg += 'You won in only ' + moveCount + ' moves.';
  } else if (moveCount > 25) {
    congrat_msg += 'You won after a while.'; 
  } else {
    congrat_msg += 'You won in ' + moveCount + ' moves.';
  }
  
  text(congrat_msg, margin_size * 2 + shape_size / 2, 2 * margin_size + shape_size * 1.5, shape_size * 4 - 2 * margin_size, shape_size * 2 - 2 * margin_size);
}

function drawPiece(index) {
  strokeWeight(margin_size/6);
  stroke(100);
  fill(board[index] ? 220 : 51);
  rect((index%5)*shape_size+margin_size, Math.floor(index/5)*shape_size+margin_size, shape_size, shape_size);
}

function drawScoreboard() {
  textSize(text_size);
  strokeWeight(0);
  fill(0);
  text('Moves: ' + moveCount, margin_size, shape_size * 5 + 4 * margin_size + text_size, shape_size*5, button_height);
}

function drawButtons() {  
  stroke(0);
  strokeWeight(1);
  fill(220);
  
  rect(margin_size, shape_size * 5 + 2 * margin_size, button_width, button_height);
  rect(shape_size * 5 / 2 + 2 * margin_size, shape_size * 5 + 2 * margin_size, button_width, button_height);
  
  textAlign(CENTER, CENTER);
  textSize(text_size);
  strokeWeight(0);
  fill(0);
  
  text('New Game', margin_size, shape_size * 5 + 2 * margin_size, button_width, button_height);
  text('Reset', button_width + 3 * margin_size, shape_size * 5 + 2 * margin_size, button_width, button_height);
}

function mouseClicked() {  
  if (mouseY >= shape_size * 5 + 2 * margin_size && mouseY <= shape_size * 5 + button_height + 2 * margin_size) {
    if (mouseX > margin_size && mouseX <= margin_size + button_width) {
      // new game
      randomBoard();
    } else if (mouseX > button_width + 3 * margin_size && mouseX <= shape_size * 5 + margin_size) {
      // reset to initial board
      resetToInitial();
    }
    
    return;
  }
  
  // get piece number from x/y
  let column = Math.floor((mouseX-margin_size) / shape_size);
  let row    = Math.floor((mouseY-margin_size) / shape_size);

  if (column <= 4 && row <= 4) {
    if (!flag_Won) {
      toggleIndexAndAdjacent(row * 5 + column);
      moveCount++;
      checkWinCondition();
    } else {
      randomBoard();
    }
  }
}

function toggleIndexAndAdjacent(index) {
  let lights_to_flip = [index];

  let row = Math.floor(index / 5);
  let column = index % 5;
  
  if (column > 0) {
    lights_to_flip.push(index-1);
  }
  
  if (column < 4) {
    lights_to_flip.push(index+1);
  }
  
  if (row > 0) {
    lights_to_flip.push(index-5);
  }
  
  if (row < 4) {
    lights_to_flip.push(index+5);
  }
  
  lights_to_flip.forEach(function(light){
    board[light] = !board[light];
  });
}

function checkWinCondition() {
  let sum = 0;
  for (let i = 0; i < 25; i++) {
    sum += board[i];
  }
  
  if (sum == 25 || sum == 0) {
    flag_Won = 1;
  }
}

function resetBoard() {
  board = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0
  ];
  
  moveCount = 0;
  flag_Won = 0;
}

function resetToInitial() {
  for (let i = 0; i < 25; i++) {
    board[i] = init_board[i];
  }
  
  moveCount = 0;
  flag_Won = 0;
}

function randomBoard() {
  resetBoard();
  
  // flip some lights at random
  for (let i = 0; i < 25; i++) {
    if (getRandomInt(3) > 1) { // 2 out of 3 chance of flipping
      toggleIndexAndAdjacent(i);
    }
  }

  // copy into a placeholder so we can reset
  for (let i = 0; i < 25; i++) {
    init_board[i] = board[i];
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}