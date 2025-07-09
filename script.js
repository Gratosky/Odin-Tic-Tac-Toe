const GameBoard = (function () {
  let board = [["", "", ""], [("", "", "")], [("", "", "")]];

  const getBoard = () => [...board.map((row) => [...row])];

  const placeMark = (row, col, mark) => {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      console.log("Invalid row or column for placeMark");
      return false;
    }

    if (board[row][col] === "") {
      board[row][col] = mark;

      return true;
    }
    console.log(`Cell already taken!!`);
    return false;
  };

  const checkWin = (playerMark) => {
    const currentBoard = getBoard(); // Get the current state of the board

    const winConditions = [
      // Horizontal
      [currentBoard[0][0], currentBoard[0][1], currentBoard[0][2]],
      [currentBoard[1][0], currentBoard[1][1], currentBoard[1][2]],
      [currentBoard[2][0], currentBoard[2][1], currentBoard[2][2]],
      // Vertical
      [currentBoard[0][0], currentBoard[1][0], currentBoard[2][0]],
      [currentBoard[0][1], currentBoard[1][1], currentBoard[2][1]],
      [currentBoard[0][2], currentBoard[1][2], currentBoard[2][2]],
      // Diagonal
      [currentBoard[0][0], currentBoard[1][1], currentBoard[2][2]],
      [currentBoard[0][2], currentBoard[1][1], currentBoard[2][0]],
    ];

    return winConditions.some(
      (condition) =>
        condition[0] === playerMark &&
        condition[1] === playerMark &&
        condition[2] === playerMark
    );
  };

  // Checks if the board is full (a draw)
  const checkDraw = () => {
    return board.every((row) => row.every((cell) => cell !== ""));
  };

  const resetBoard = () => {
    board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  };

  return {
    getBoard,
    placeMark,
    checkWin,
    checkDraw,
    resetBoard,
  };
})();

const GameController = (function (gameboard) {
  const playerX = { name: "Player X", mark: "X" };
  const playerO = { name: "Player O", mark: "O" };

  let activePlayer = playerX;
  let gameActive = true; // State to control if game is still playable
  let gameStatusMessage = "";

  // Switches the active player
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === playerX ? playerO : playerX;
  };

  // Resets the game state and board
  const resetGame = () => {
    GameBoard.resetBoard(); // Reset the board in the Gameboard module
    activePlayer = playerX; // Reset to Player X
    gameActive = true;
    gameStatusMessage = `${activePlayer.name}'s Turn`;
  };

  const makeMove = (cell) => {
    if (!gameActive) {
      gameStatusMessage = `Game over!Refresh to play again!`;
      return;
    }

    const row = Math.floor(cell / 3);
    const col = cell % 3;

    const currentPlayerMark = activePlayer.mark;
    const currentPlayerName = activePlayer.name;

    if (GameBoard.placeMark(row, col, currentPlayerMark)) {
      if (GameBoard.checkWin(currentPlayerMark)) {
        gameStatusMessage = `Congrats ${currentPlayerName}'s win!`;
        gameActive = false;
      } else if (GameBoard.checkDraw()) {
        gameStatusMessage = `It's a draw!`;
        gameActive = false;
      } else {
        console.log(activePlayer.name);
        console.log(`+++------+++------+++`);
        switchPlayerTurn();
        console.log(activePlayer.name);
        gameStatusMessage = `${activePlayer.name}'s Turn!`;
      }
      return true;
    } else {
      gameStatusMessage = `This cell is already taken!`;
      return false;
    }
  };

  const getGameStatus = () => gameStatusMessage;

  const isGameOver = () => !gameActive;

  const init = () => {
    resetGame();
  };

  return {
    init,
    getGameStatus,
    makeMove,
    isGameOver,
    resetGame,
  };
})(GameBoard);

const ScreenController = function () {
  const gameBoardElement = document.querySelector(".game-board");
  const cells = document.querySelectorAll(".cell"); // This gets all 9 cell divs
  const gameStatusDisplay = document.querySelector(".game-status");
  const resetButton = document.querySelector(".game-reset");

  const updateDisplay = () => {
    const currentBoardState = GameBoard.getBoard();

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const cellContent = currentBoardState[row][col];
      cell.textContent = cellContent;

      cell.classList.remove("x-mark", "o-mark");
      if (cellContent === "X") {
        cell.classList.add("x-mark");
      } else if (cellContent === "O") {
        cell.classList.add("o-mark");
      }
    });

    gameStatusDisplay.textContent = GameController.getGameStatus();
  };

  function handleCellClick(e) {
    if (GameController.isGameOver()) {
      return;
    }

    const clickedCellIndex = parseInt(e.target.dataset.cellIndex);

    if (GameController.makeMove(clickedCellIndex)) {
      updateDisplay();
    } else {
      updateDisplay();
    }
  }

  const handleResetClick = () => {
    GameController.resetGame();
    updateDisplay();
  };

  const initScreen = () => {
    cells.forEach((cell) => {
      cell.addEventListener("click", handleCellClick);
    });

    resetButton.addEventListener("click", handleResetClick);

    updateDisplay();
  };

  return {
    initScreen,
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const screen = ScreenController();

  GameController.init();
  screen.initScreen();
});
