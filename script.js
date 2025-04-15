let currentPlayer = 'X';
let gameBoard = Array(9).fill(null);
const buttons = document.querySelectorAll('.grid button');
const statusDiv = document.getElementById('status');
const resetButton = document.getElementById('resetButton');
const gameModeSelector = document.getElementById('gameMode');
const levelInfoDiv = document.getElementById('levelInfo');
let currentLevel = 1;

// Button click handler
buttons.forEach((button, index) => {
    button.addEventListener('click', () => handleMove(index), {once: true});
});

// Reset the game
resetButton.addEventListener('click', resetGame);

// Set Game Mode (Player vs Player or Player vs Computer)
gameModeSelector.addEventListener('change', resetGame);

function handleMove(index) {
    if (gameBoard[index]) return; // Ignore if the cell is already filled

    gameBoard[index] = currentPlayer;
    buttons[index].textContent = currentPlayer;
    buttons[index].classList.add('disabled');

    if (checkWinner()) {
        statusDiv.textContent = `Player ${currentPlayer} Wins!`;
        setTimeout(resetGame, 2000);
        return;
    } else if (gameBoard.every(cell => cell)) {
        statusDiv.textContent = 'Draw!';
        setTimeout(resetGame, 2000);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.textContent = `Player ${currentPlayer}'s Turn`;

    if (currentPlayer === 'O' && gameModeSelector.value === 'playerVsComputer') {
        setTimeout(() => computerPlay(), 500); // Delay for computer to make a move
    }
}

// Check if there is a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
    });
}

// Computer makes a move with increasing difficulty
function computerPlay() {
    let move;

    // Easy mode (random move)
    if (currentLevel <= 10) {
        const availableMoves = gameBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } 
    // Medium/Hard mode (AI with simple strategy)
    else {
        move = bestMove();
    }

    gameBoard[move] = 'O';
    buttons[move].textContent = 'O';
    buttons[move].classList.add('disabled');

    if (checkWinner()) {
        statusDiv.textContent = `Player O Wins!`;
        setTimeout(resetGame, 2000);
    } else if (gameBoard.every(cell => cell)) {
        statusDiv.textContent = 'Draw!';
        setTimeout(resetGame, 2000);
    } else {
        currentPlayer = 'X';
        statusDiv.textContent = `Player X's Turn`;
    }

    currentLevel = Math.min(currentLevel + 1, 50);  // Increase difficulty level, max 50
    levelInfoDiv.textContent = `Level: ${currentLevel}`;
}

// Find the best move for computer (Medium/Hard difficulty)
function bestMove() {
    const availableMoves = gameBoard.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Reset the game
function resetGame() {
    gameBoard = Array(9).fill(null);
    buttons.forEach(button => {
        button.textContent = '';
        button.classList.remove('disabled');
    });
    currentPlayer = 'X';
    statusDiv.textContent = `Player X's Turn`;
    levelInfoDiv.textContent = `Level: 1`;
    currentLevel = 1;
}
