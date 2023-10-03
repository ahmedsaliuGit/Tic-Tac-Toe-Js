const gameboard = document.getElementById("gameboard");

(function renderGameboard() {
  for (let i = 0; i < 9; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.dataset.index = i;
    gameboard.appendChild(square);
  }
})();

const board = [null, null, null, null, null, null, null, null, null];

const Player = (mark) => {
  this.mark = mark;

  const getMark = () => {
    return mark;
  };

  return { getMark };
};

const gameBoard = (() => {
  const setSquare = (index, mark) => {
    if (index > board.length) return;
    board[index] = mark;
  };

  const getSquare = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = null;
    }
  };

  return { setSquare, getSquare, reset };
})();

const displayController = (() => {
  const squareElements = document.querySelectorAll(".square");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  squareElements.forEach((square) =>
    square.addEventListener("click", (e) => {
      if (gameController.getIsOver() || e.target.textContent !== "") return;
      gameController.playRound(parseInt(e.target.dataset.index));
      updateGameboard();
    })
  );

  restartButton.addEventListener("click", (e) => {
    gameBoard.reset();
    gameController.reset();
    updateGameboard();
    setMessageElement("Player X's turn");
  });

  const updateGameboard = () => {
    for (let i = 0; i < squareElements.length; i++) {
      squareElements[i].textContent = gameBoard.getSquare(i);
    }
  };

  const setResultMessage = (winner) => {
    if (winner === "Draw") {
      setMessageElement("It's a draw!");
    } else {
      setMessageElement(`Winner: Player ${winner}`);
    }
  };

  const setMessageElement = (message) => {
    messageElement.textContent = message;
  };

  return { setResultMessage, setMessageElement };
})();

const gameController = (() => {
  const playerX = Player("X");
  const playerO = Player("O");
  let round = 1;
  let isOver = false;

  const playRound = (squareIndex) => {
    gameBoard.setSquare(squareIndex, getCurrentPlayerMark());
    if (checkWinner(board)) {
      displayController.setResultMessage(getCurrentPlayerMark());
      isOver = true;
      return;
    }
    if (round === 9) {
      displayController.setResultMessage("Draw");
      isOver = true;
      return;
    }
    round++;
    displayController.setMessageElement(
      `Player ${getCurrentPlayerMark()}'s turn`
    );
  };

  const getCurrentPlayerMark = () => {
    return round % 2 === 1 ? playerX.getMark() : playerO.getMark();
  };

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return lines[i];
      }
    }
    return null;
  };

  const getIsOver = () => {
    return isOver;
  };

  const reset = () => {
    round = 1;
    isOver = false;
  };

  return { playRound, getIsOver, reset };
})();
