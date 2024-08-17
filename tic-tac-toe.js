/**** STATE  ****/

/* Here I start by creating an empty array for the grid spaces! Then create a function that first makes sure its got nothing in it by setting the length to 0 (this is essential for when we run the reset button later) and then using a for loop pushes 9 tiles that have 3 attributes, whether or not they're for X or O, and if they've been claimed. */
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
/* Now we call this function once so those grid spaces exist from the very get go!*/
initializeSpaces();

/* This is some basic state stuff where we set the turn to 0 at the start of the game, and also the gameStatus to playing.*/
let turn = 0;
let gameStatus = "playing";



/**** RENDERING ****/ 

/* Here I create some variables that are just easy ways to get the DOM elements I created in the html file for the board, the start button, and the message about who's turn it is! */
const board = document.getElementById("board");
const startButton = document.getElementById("startButton");
const turnMessage = document.getElementById("turn-status");

/* This is a function that shows the win or draw alert! It sees if the gameStatus isn't playing, then makes a new variable called alert, and sets the class and role to the bootstrap alert classes and roles, and then the textContent to whatever gameStatus is! Finally it appends the board to have the alert :)*/
function renderUserMessage() {
    if (gameStatus !== "playing") {
        const alert = document.createElement("div");
        alert.className = "alert alert-primary";
        alert.role = "alert";
        alert.textContent = gameStatus;
        board.appendChild(alert);
    }
}

/* This is the function that we will use to render the board anytime ANYTHING in the state changes. It works by setting everything to a blank string at the start so that it doesn't create duplicate boards everytime something changes. Then using a for loop, creates all of the elements in the DOM tied to each space in the spaces array. I used a tenurary operator for whether or not the emoji shows X or O which I think is fun! And then I append that new div to the board.*/



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

        /**** LISTENING  ****/

        /* This code I wrote to handle what happens when a player clicks on a space! First it sees if the status isn't playing or the space is claimed so that it doesn't keep going after game over, or claim an already claimed space. Then checks to see who's turn it is and sets the approriate attribute to true and changes the turnMessage text content to reflect the new turn.*/
        function handleClickBasedOnTurn() {
            if (gameStatus !== "playing" || space.isClaimed) return;

            if (turn % 2 === 0) {
                space.isX = true;
                turnMessage.textContent = "It's Player 2's turn";
            } else {
                space.isO = true;
                turnMessage.textContent = "It's Player 1's turn";
            }
            /* This part of the function is down here so it doesn'tn get doubled up in the above if else. Sets the space to claimed, updates the gamestatus using the getGameStatus function, calls the renderBoard function as well as the renderUserMessage function, and increments the turn.*/
            space.isClaimed = true;
            gameStatus = getGameStatus();
            renderBoard();
            renderUserMessage();
            turn++;
        }
        
        /* This is the event listener that reacts when you click on it!*/
        div.addEventListener("click", handleClickBasedOnTurn);
    }
}


/* This is the function I wrote to handle what happens when you click the start button. It also changes the start button into the reset button! */
function handleStartGame() {
    renderBoard();
    turn = 0; // Reset the turn counter
    turnMessage.textContent = "It's Player 1's turn";
    startButton.className = "btn btn-primary mx-auto d-block";
    startButton.textContent = "Reset";
    startButton.removeEventListener("click", handleStartGame);
    startButton.addEventListener("click", handleResetGame);
}

/* This is the code that runs when you click the reset button! It calls the initiliazeSpaces function, sets the turn to 0, resets the gameStatus to playing, renders the board anew, and resets the turn message.*/
function handleResetGame() {
    initializeSpaces();
    turn = 0;
    gameStatus = "playing";
    renderBoard();
    turnMessage.textContent = "It's Player 1's turn"
}

/* Gotta have an eventListener on the button to start!*/
startButton.addEventListener("click", handleStartGame);


/* This is the code that checks to see if someone wins! It establishes an array of winning combinations, and then using a for loop to iterate through the winning combinations, compares each space to see if any of the combinations have all spaces.isX or spaces.isO true.*/
function getGameStatus() {
    const winningCombinations = [
        [0, 1, 2], 
        [3, 4, 5],  
        [6, 7, 8], 
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [0, 3, 6],
        [2, 4, 6]  
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;

        if (spaces[a].isX && spaces[b].isX && spaces[c].isX) {
            return "Player 1 Wins!";
        }

        if (spaces[a].isO && spaces[b].isO && spaces[c].isO) {
            return "Player 2 Wins!";
        }
    }
    /* This is the last bit of code that checks to see if all of the spaces are filled and its a draw! But tic tac toe is a solved game so you should never draw if you are paying attention and not a child. :P*/
    const allSpacesFilled = spaces.every(space => space.isX || space.isO);
    if (allSpacesFilled) {
        return "It's a Draw!";
    }

    return "playing";
}
