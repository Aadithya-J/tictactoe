import { useState, useEffect, useCallback } from "react";
import { getBestMove, calculateWinner } from "./utils";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [player, setPlayer] = useState(null);

  const handleClick = useCallback(
    (index) => {
      if (winner || board[index] || isThinking || !player) return;
      const newBoard = [...board];
      newBoard[index] = player;
      setBoard(newBoard);
      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
      } else {
        setIsXNext(!isXNext);
      }
    },
    [winner, board, isThinking, player, isXNext]
  );

  useEffect(() => {
    if (!winner && !isXNext && player === "X") {
      setIsThinking(true);
      setTimeout(() => {
        const aiMove = getBestMove(board, "O");
        if (aiMove !== null) {
          const newBoard = [...board];
          newBoard[aiMove] = "O";
          setBoard(newBoard);
          const gameWinner = calculateWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
          }
        }
        setIsThinking(false);
        setIsXNext(true);
      }, 1000);
    } else if (!winner && isXNext && player === "O") {
      setIsThinking(true);
      setTimeout(() => {
        const aiMove = getBestMove(board, "X");
        if (aiMove !== null) {
          const newBoard = [...board];
          newBoard[aiMove] = "X";
          setBoard(newBoard);
          const gameWinner = calculateWinner(newBoard);
          if (gameWinner) {
            setWinner(gameWinner);
          }
        }
        setIsThinking(false);
        setIsXNext(false);
      }, 1000);
    }
  }, [isXNext, winner, board, player]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsThinking(false);
  };

  const renderSquare = (index) => (
    <button
      key={index}
      className={`w-full aspect-square text-4xl font-bold rounded-lg shadow-md 
                  transition-all duration-300 ease-in-out
                  ${
                    !board[index] &&
                    !winner &&
                    ((isXNext && player === "X") ||
                      (!isXNext && player === "O"))
                      ? "hover:bg-blue-100"
                      : ""
                  }
                  ${
                    board[index] === "X"
                      ? "bg-blue-500 text-white"
                      : board[index] === "O"
                      ? "bg-red-500 text-white"
                      : "bg-white"
                  }
                  ${
                    isThinking || !player || !!board[index] || !!winner
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
      onClick={() => handleClick(index)}
      disabled={isThinking || !player || !!board[index] || !!winner}
    >
      {board[index]}
    </button>
  );

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every((square) => square !== null)) {
    status = "It's a draw!";
  } else {
    status = isThinking
      ? "AI is thinking..."
      : `Next player: ${isXNext ? "X" : "O"}`;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-red-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Tic Tac Toe
        </h1>

        {/* Player Selection */}
        {!player && (
          <div className="mb-6 text-center">
            <p className="text-lg mb-2">Choose your player:</p>
            <button
              className="px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg mr-2"
              onClick={() => {
                setPlayer("X");
                resetGame();
              }}
            >
              Play as X
            </button>
            <button
              className="px-4 py-2 text-lg font-semibold text-white bg-red-500 rounded-lg"
              onClick={() => {
                setPlayer("O");
                resetGame();
              }}
            >
              Play as O
            </button>
          </div>
        )}

        {/* Game Status */}
        <div
          className={`text-xl font-semibold text-center mb-4 p-2 rounded
                         ${
                           winner
                             ? "bg-green-100 text-green-800"
                             : board.every((square) => square !== null)
                             ? "bg-yellow-100 text-yellow-800"
                             : "bg-blue-100 text-blue-800"
                         }`}
        >
          {status}
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((_, index) => renderSquare(index))}
        </div>

        {/* Reset Button */}
        <button
          className="w-full py-2 text-lg font-semibold text-white bg-purple-500 rounded-lg 
                     shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 
                     focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-300"
          onClick={() => {
            setPlayer(null);
            resetGame();
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
