import { useState, useEffect, useCallback } from 'react';
import { getBestMove, calculateWinner } from './utils';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleClick = useCallback((index) => {
    if (winner || board[index] || (!isXNext && !isThinking)) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  }, [winner, board, isXNext, isThinking]);

  useEffect(() => {
    if (!isXNext && !winner) {
      setIsThinking(true);
      setTimeout(() => {
        const aiMove = getBestMove(board, 'O');
        handleClick(aiMove);
        setIsThinking(false);
      }, 1000);
    }
  }, [isXNext, winner, board, handleClick]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderSquare = (index) => (
    <button
      key={index}
      className={`w-full aspect-square text-4xl font-bold rounded-lg shadow-md 
                  transition-all duration-300 ease-in-out
                  ${!board[index] && !winner && isXNext ? 'hover:bg-blue-100' : ''}
                  ${board[index] === 'X' ? 'bg-blue-500 text-white' : 
                    board[index] === 'O' ? 'bg-red-500 text-white' : 'bg-white'}
                  ${(!isXNext || isThinking) && !board[index] ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={() => handleClick(index)}
      disabled={!isXNext || isThinking || !!board[index] || !!winner}
    >
      {board[index]}
    </button>
  );

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (board.every(square => square !== null)) {
    status = "It's a draw!";
  } else {
    status = isThinking ? "AI is thinking..." : `Next player: ${isXNext ? 'X' : 'O'}`;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-red-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Tic Tac Toe</h1>
        <div className={`text-xl font-semibold text-center mb-4 p-2 rounded
                         ${winner ? 'bg-green-100 text-green-800' : 
                           board.every(square => square !== null) ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-blue-100 text-blue-800'}`}>
          {status}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((_, index) => renderSquare(index))}
        </div>
        <button 
          className="w-full py-2 text-lg font-semibold text-white bg-purple-500 rounded-lg 
                     shadow-md hover:bg-purple-600 focus:outline-none focus:ring-2 
                     focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-300"
          onClick={resetGame}
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;