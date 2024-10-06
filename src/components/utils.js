export const getBestMove = (board, player) => {
    const opponent = player === 'X' ? 'O' : 'X';
    
    const minimax = (board, depth, isMaximizing) => {
      const winner = calculateWinner(board);
      if (winner === player) return 10 - depth;
      if (winner === opponent) return depth - 10;
      if (board.every(cell => cell !== null)) return 0;
  
      const currentPlayer = isMaximizing ? player : opponent;
      let bestScore = isMaximizing ? -Infinity : Infinity;
      let bestMove;
  
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = currentPlayer;
          const score = minimax(board, depth + 1, !isMaximizing);
          board[i] = null;
  
          if (isMaximizing) {
            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }
          } else {
            if (score < bestScore) {
              bestScore = score;
              bestMove = i;
            }
          }
        }
      }
  
      return depth === 0 ? bestMove : bestScore;
    };
  
    return minimax(board, 0, true);
  };
  
  export const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];
  
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };