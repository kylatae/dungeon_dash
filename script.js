let gridSize = 10;
let maze = [];
let playerRow = 1;
let playerCol = 1;
let moveCounter = 0;
const mazeDiv = document.getElementById('maze');
// Initialize the maze
for (let row = 0; row < gridSize+1; row++) {
    maze[row] = [];
    for (let col = 0; col < gridSize; col++) {
        maze[row][col] = 'blocked'; // Initially all rooms are blocked
    }
}

function resetGame() {
  // Increase the maze size if under 100
  if (gridSize < 100) {
      gridSize += 10;
  }

  moveCounter = 0;
  document.getElementById('moveCounter').textContent = moveCounter;
  document.getElementById('message').textContent = "";

  // Reinitialize maze with updated gridSize
  maze.length = 0; 
  for (let row = 0; row < gridSize + 1; row++) {
      maze[row] = []; 
      for (let col = 0; col < gridSize + 1; col++) { 
          maze[row][col] = 'blocked'; 
      }
  }
  playerRow = playerCol = 1; 
  generateMaze(playerRow, playerCol);
  displayMaze();
  enableButtons(); 
  document.getElementById('newGameButton').style.display = 'none'; // Hide button
}

function generateMaze(startRow, startCol) {
  // Adjusted start and end points
  startRow = 1;
  startCol = 1;
  maze[startRow][startCol] = 'open';
  maze[gridSize - 2][gridSize - 2] = 'open';

  maze[startRow][startCol] = 'open'; // Mark starting point as open

  let directions = [[0, 2], [0, -2], [2, 0], [-2, 0]]; // Up, Down, Right, Left (order will be shuffled)

  function carvePassage(row, col) {
      // Shuffle possible directions
      for (let i = directions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [directions[i], directions[j]] = [directions[j], directions[i]];
      }

      for (const [dr, dc] of directions) {
          const newRow = row + dr;
          const newCol = col + dc;

          // Check if within bounds and if the room is blocked
          if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize &&
              maze[newRow][newCol] === 'blocked') {

              maze[row + dr / 2][col + dc / 2] = 'open'; // Carve path between
              maze[newRow][newCol] = 'open';      
              carvePassage(newRow, newCol); // Recursively explore new room
          }
      }
  }

  carvePassage(startRow, startCol);
  maze[startRow][startCol] = 'player';
  maze[gridSize - 1][gridSize - 1] = 'finish';
}

generateMaze(1, 1);
// maze[gridSize - 1][gridSize - 1] = 'open'; // Set the end point as open
console.log(maze)




function movePlayer(direction) {
  let newRow = playerRow;
  let newCol = playerCol;

  switch (direction) {
      case 'up':
          newRow = playerRow - 1;
          break;
      case 'down':
          newRow = playerRow + 1;
          break;
      case 'left':
          newCol = playerCol - 1;
          break;
      case 'right':
          newCol = playerCol + 1;
          break;
  }

  // Check if the move is valid
  if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize &&
      (maze[newRow][newCol] === 'open' || maze[newRow][newCol] === 'finish')) {
      
    if (maze[newRow][newCol] === 'finish') {
        disableButtons();
    }

    // Update player position
    maze[playerRow][playerCol] = 'open'; // Mark old position as open
    playerRow = newRow;
    playerCol = newCol;
    maze[playerRow][playerCol] = 'player';

    displayMaze(); // Update the display

    document.getElementById('message').textContent = ""; // Clear message if the move is valid
  } else {
    // If move is not valid 
    document.getElementById('message').textContent = "You cannot move in that direction";
  }
  moveCounter++;
  document.getElementById('moveCounter').textContent = moveCounter;
}

// Function to disable buttons
function disableButtons() {
  const buttons = document.querySelectorAll('.controls button');
  buttons.forEach(button => button.disabled = true);
  window.removeEventListener('keydown', handleKeyDown);
  document.getElementById('newGameButton').style.display = 'block'; // Show button
}

// Function to enable buttons 
function enableButtons() { 
  const buttons = document.querySelectorAll('.controls button'); 
  buttons.forEach(button => button.disabled = false);
  window.addEventListener('keydown', handleKeyDown); // Re-enable arrow keys
}


// Event listeners for buttons
document.getElementById('up').addEventListener('click', () => movePlayer('up'));
document.getElementById('down').addEventListener('click', () => movePlayer('down'));
document.getElementById('left').addEventListener('click', () => movePlayer('left'));
document.getElementById('right').addEventListener('click', () => movePlayer('right'));
document.getElementById('newGameButton').addEventListener('click', resetGame);


// Function to handle keyboard input
function handleKeyDown(event) {
  switch (event.key) {
      case 'ArrowUp':
          movePlayer('up');
          break;
      case 'ArrowDown':
          movePlayer('down');
          break;
      case 'ArrowLeft':
          movePlayer('left');
          break;
      case 'ArrowRight':
          movePlayer('right');
          break;
  }
}

// Add event listener for key presses and remove event listener on win
window.addEventListener('keydown', handleKeyDown);




function displayMaze() {
  mazeDiv.innerHTML = ''; 
  mazeDiv.style.gridTemplateColumns = `repeat(${gridSize + 1}, 1fr)`; 
  // Clear the grid    
  for (let row = 0; row < gridSize+1; row++) 
  {        
    for (let col = 0; col < gridSize+1; col++) 
    {            
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (maze[row][col] === 'open') 
      {
        cell.classList.add('open');
      } 
      // Add markers for player and finish
      else if (maze[row][col] === 'player') 
      {
        cell.classList.add('player');
      } 
      else if (maze[row][col] === 'finish')
      
      {
        cell.classList.add('finish');
      } 
      else
      {               
        cell.classList.add('blocked');
      } 
        mazeDiv.appendChild(cell); 
    }   
  }
}

displayMaze(); // Call the function to initially display the maze