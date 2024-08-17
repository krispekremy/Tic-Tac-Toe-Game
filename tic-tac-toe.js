/**** STATE  ****/

const spaces = [];

function initializeSpaces() {
    spaces.length = 0;
    for(let i = 0; i < 9; i++) {
        spaces.push({
            isX: false,
            isO: false,
            isClaimed: false
        });
     }
}
    
initializeSpaces();

let turn = 0;
let gameStatus = "playing";



/**** RENDERING ****/ 

const board = document.getElementById("board");
const startButton = document.getElementById("startButton");
const turnMessage = document.getElementById("turn-status");

function renderBoard() {
    board.innerHTML = "";

    for(const space of spaces) {
        const div = document.createElement("div");
        div.style.height = '40px';
        div.style.width = '40px';
        div.style.backgroundColor = "lightgray";
        div.className = "text-center p-2";
        div.textContent = space.isX ? "❌" : space.isO ? "⭕" : "";
        board.appendChild(div);

        /**** ALSO LISTENING  ****/
        function handleClickBasedOnTurn() {
            if (gameStatus !== "playing" || space.isClaimed) return; // Prevent further moves if the game is over

            if (turn % 2 === 0) {
                space.isX = true;
                turnMessage.textContent = "It's Player 2's turn";
            } else {
                space.isO = true;
                turnMessage.textContent = "It's Player 1's turn";
            }
            
            space.isClaimed = true;
            gameStatus = getGameStatus();
            renderBoard();
            renderUserMessage();
            turn++;
        }
    
        div.addEventListener("click", handleClickBasedOnTurn);
    }
}

function renderUserMessage() {
    if (gameStatus !== "playing") {
        const alert = document.createElement("div");
        alert.className = "alert alert-primary";
        alert.role = "alert";
        alert.textContent = gameStatus;
        board.appendChild(alert);
    }
}

/**** LISTENING ****/

function handleStartGame() {
    renderBoard();
    turn = 0; // Reset the turn counter
    turnMessage.textContent = "It's Player 1's turn";
    startButton.className = "btn btn-primary mx-auto d-block";
    startButton.textContent = "Reset";
    startButton.removeEventListener("click", handleStartGame);
    startButton.addEventListener("click", handleResetGame);
}

function handleResetGame() {
    initializeSpaces();
    turn = 0;
    gameStatus = "playing";
    renderBoard();
    turnMessage.textContent = "It's Player 1's turn"
}

startButton.addEventListener("click", handleStartGame);

function getGameStatus() {
    const winningCombinations = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Top-left to bottom-right diagonal
        [2, 4, 6]  // Top-right to bottom-left diagonal
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (spaces[a].isX && spaces[b].isX && spaces[c].isX) {
            return "Player 1 Wins!"; // Player 1 with "X" wins
        }

        if (spaces[a].isO && spaces[b].isO && spaces[c].isO) {
            return "Player 2 Wins!"; // Player 2 with "O" wins
        }
    }

    const allSpacesFilled = spaces.every(space => space.isX || space.isO);
    if (allSpacesFilled) {
        return "It's a Draw!";
    }

    return "playing";
}
