import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Clock, Crown, Sword, Shield } from 'lucide-react';

const Chess = ({ onGameEnd, timeLimit = 900 }) => { // 15 minutes default
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ white: timeLimit, black: timeLimit });
  const [isPlaying, setIsPlaying] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });

  // Chess piece symbols
  const pieces = {
    white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    },
    black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟'
    }
  };

  // Initialize chess board
  const initializeBoard = useCallback(() => {
    const board = Array(8).fill().map(() => Array(8).fill(null));
    
    // Set up pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: 'pawn', color: 'black', hasMoved: false };
      board[6][i] = { type: 'pawn', color: 'white', hasMoved: false };
    }
    
    // Set up other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: backRow[i], color: 'black', hasMoved: false };
      board[7][i] = { type: backRow[i], color: 'white', hasMoved: false };
    }
    
    return board;
  }, []);

  // Get valid moves for a piece
  const getValidMoves = (board, row, col) => {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves = [];
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward move
        if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
          moves.push([row + direction, col]);
          
          // Double move from starting position
          if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push([row + 2 * direction, col]);
          }
        }
        
        // Diagonal captures
        for (let c of [col - 1, col + 1]) {
          if (c >= 0 && c < 8 && row + direction >= 0 && row + direction < 8) {
            const targetPiece = board[row + direction][c];
            if (targetPiece && targetPiece.color !== piece.color) {
              moves.push([row + direction, c]);
            }
          }
        }
        break;
        
      case 'rook':
        // Horizontal and vertical moves
        for (let dir of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          let r = row + dir[0];
          let c = col + dir[1];
          while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (!board[r][c]) {
              moves.push([r, c]);
            } else {
              if (board[r][c].color !== piece.color) {
                moves.push([r, c]);
              }
              break;
            }
            r += dir[0];
            c += dir[1];
          }
        }
        break;
        
      case 'bishop':
        // Diagonal moves
        for (let dir of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          let r = row + dir[0];
          let c = col + dir[1];
          while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (!board[r][c]) {
              moves.push([r, c]);
            } else {
              if (board[r][c].color !== piece.color) {
                moves.push([r, c]);
              }
              break;
            }
            r += dir[0];
            c += dir[1];
          }
        }
        break;
        
      case 'queen':
        // Combine rook and bishop moves
        for (let dir of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          let r = row + dir[0];
          let c = col + dir[1];
          while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (!board[r][c]) {
              moves.push([r, c]);
            } else {
              if (board[r][c].color !== piece.color) {
                moves.push([r, c]);
              }
              break;
            }
            r += dir[0];
            c += dir[1];
          }
        }
        break;
        
      case 'king':
        // One square in any direction
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
              if (!board[r][c] || board[r][c].color !== piece.color) {
                moves.push([r, c]);
              }
            }
          }
        }
        break;
        
      case 'knight':
        // L-shaped moves
        for (let [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (!board[r][c] || board[r][c].color !== piece.color) {
              moves.push([r, c]);
            }
          }
        }
        break;
    }
    
    return moves;
  };

  // Check if king is in check
  const isKingInCheck = (board, color) => {
    // Find king position
    let kingRow, kingCol;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] && board[r][c].type === 'king' && board[r][c].color === color) {
          kingRow = r;
          kingCol = c;
          break;
        }
      }
    }
    
    // Check if any opponent piece can attack the king
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] && board[r][c].color !== color) {
          const moves = getValidMoves(board, r, c);
          if (moves.some(([mr, mc]) => mr === kingRow && mc === kingCol)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // Check if game is over (checkmate or stalemate)
  const checkGameOver = (board, currentPlayer) => {
    // Check if current player has any valid moves
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] && board[r][c].color === currentPlayer) {
          const moves = getValidMoves(board, r, c);
          for (let [mr, mc] of moves) {
            // Try the move and see if it gets out of check
            const tempBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
            tempBoard[mr][mc] = tempBoard[r][c];
            tempBoard[r][c] = null;
            
            if (!isKingInCheck(tempBoard, currentPlayer)) {
              return false; // Found a valid move
            }
          }
        }
      }
    }
    
    // No valid moves found
    if (isKingInCheck(board, currentPlayer)) {
      return 'checkmate';
    } else {
      return 'stalemate';
    }
  };

  // Handle piece selection
  const handlePieceClick = (row, col) => {
    if (!isPlaying || gameOver) return;
    
    const piece = board[row][col];
    
    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      
      // Check if clicking on a valid move
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        makeMove(selectedRow, selectedCol, row, col);
      }
      
      setSelectedPiece(null);
      setValidMoves([]);
    } else if (piece && piece.color === currentPlayer) {
      setSelectedPiece([row, col]);
      setValidMoves(getValidMoves(board, row, col));
    }
  };

  // Make a move
  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const newBoard = board.map(row => row.map(cell => cell ? { ...cell } : null));
    const piece = newBoard[fromRow][fromCol];
    
    // Capture piece if present
    if (newBoard[toRow][toCol]) {
      const capturedPiece = newBoard[toRow][toCol];
      setCapturedPieces(prev => ({
        ...prev,
        [currentPlayer]: [...prev[currentPlayer], capturedPiece]
      }));
    }
    
    // Move piece
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;
    piece.hasMoved = true;
    
    // Pawn promotion
    if (piece.type === 'pawn' && (toRow === 0 || toRow === 7)) {
      newBoard[toRow][toCol] = { type: 'queen', color: piece.color, hasMoved: true };
    }
    
    setBoard(newBoard);
    setMoveHistory(prev => [...prev, {
      piece: piece.type,
      from: [fromRow, fromCol],
      to: [toRow, toCol],
      player: currentPlayer
    }]);
    
    // Check for game over
    const gameStatus = checkGameOver(newBoard, currentPlayer === 'white' ? 'black' : 'white');
    if (gameStatus) {
      setGameOver(true);
      if (gameStatus === 'checkmate') {
        setWinner(currentPlayer);
      }
      setIsPlaying(false);
    } else {
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    }
  };

  // Initialize game
  useEffect(() => {
    setBoard(initializeBoard());
    setCurrentPlayer('white');
    setGameOver(false);
    setWinner(null);
    setTimeLeft({ white: timeLimit, black: timeLimit });
    setIsPlaying(true);
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
  }, [initializeBoard, timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = { ...prev };
        newTime[currentPlayer] = Math.max(0, newTime[currentPlayer] - 1);
        
        if (newTime[currentPlayer] === 0) {
          setGameOver(true);
          setWinner(currentPlayer === 'white' ? 'black' : 'white');
          setIsPlaying(false);
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver, currentPlayer]);

  // Game end callback
  useEffect(() => {
    if (gameOver && onGameEnd) {
      onGameEnd({ 
        winner, 
        timeUsed: { 
          white: timeLimit - timeLeft.white, 
          black: timeLimit - timeLeft.black 
        },
        moveCount: moveHistory.length
      });
    }
  }, [gameOver, winner, timeLeft, timeLimit, moveHistory.length, onGameEnd]);

  const resetGame = () => {
    setBoard(initializeBoard());
    setCurrentPlayer('white');
    setGameOver(false);
    setWinner(null);
    setTimeLeft({ white: timeLimit, black: timeLimit });
    setIsPlaying(true);
    setMoveHistory([]);
    setCapturedPieces({ white: [], black: [] });
    setSelectedPiece(null);
    setValidMoves([]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellClass = (row, col) => {
    const isSelected = selectedPiece && selectedPiece[0] === row && selectedPiece[1] === col;
    const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
    const isLightSquare = (row + col) % 2 === 0;
    
    let baseClass = 'w-12 h-12 flex items-center justify-center text-2xl cursor-pointer transition-all duration-200';
    
    if (isSelected) {
      baseClass += ' bg-yellow-400';
    } else if (isValidMove) {
      baseClass += ' bg-green-300';
    } else if (isLightSquare) {
      baseClass += ' bg-amber-100';
    } else {
      baseClass += ' bg-amber-800';
    }
    
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Chess</h1>
          <p className="text-slate-600">Strategic thinking and planning</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">White Time</div>
            <div className={`text-xl font-bold ${timeLeft.white < 60 ? 'text-red-600' : 'text-slate-600'}`}>
              {formatTime(timeLeft.white)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Black Time</div>
            <div className={`text-xl font-bold ${timeLeft.black < 60 ? 'text-red-600' : 'text-slate-600'}`}>
              {formatTime(timeLeft.black)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Current Player</div>
            <div className={`text-xl font-bold ${currentPlayer === 'white' ? 'text-slate-600' : 'text-slate-800'}`}>
              {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Moves</div>
            <div className="text-xl font-bold text-blue-600">
              {moveHistory.length}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Chess Board */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-8 gap-0 border-2 border-amber-900">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClass(rowIndex, colIndex)}
                    onClick={() => handlePieceClick(rowIndex, colIndex)}
                  >
                    {cell && (
                      <span className={cell.color === 'white' ? 'text-white' : 'text-black'}>
                        {pieces[cell.color][cell.type]}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Game Info */}
          <div className="flex-1 space-y-6">
            {/* Captured Pieces */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold text-slate-800 mb-3">Captured Pieces</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600 mb-2">White Captured:</div>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces.white.map((piece, index) => (
                      <span key={index} className="text-lg">
                        {pieces.black[piece.type]}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-2">Black Captured:</div>
                  <div className="flex flex-wrap gap-1">
                    {capturedPieces.black.map((piece, index) => (
                      <span key={index} className="text-lg">
                        {pieces.white[piece.type]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Move History */}
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold text-slate-800 mb-3">Move History</h3>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {moveHistory.map((move, index) => (
                  <div key={index} className="text-sm text-slate-600">
                    {index + 1}. {move.player} {move.piece} {String.fromCharCode(97 + move.from[1])}{8 - move.from[0]} → {String.fromCharCode(97 + move.to[1])}{8 - move.to[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                New Game
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-4 shadow-lg mt-6">
          <h3 className="font-semibold text-slate-800 mb-2">How to Play:</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Click on a piece to select it and see valid moves</li>
            <li>• Click on a highlighted square to make a move</li>
            <li>• Each player has {formatTime(timeLimit)} to complete the game</li>
            <li>• Checkmate your opponent's king to win!</li>
          </ul>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="text-6xl mb-4">
                {winner ? '🏆' : '🤝'}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {winner ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!` : 'Draw!'}
              </h2>
              <p className="text-slate-600 mb-4">
                {winner ? 'Checkmate!' : 'Stalemate or time ran out.'}
              </p>
              <div className="text-lg font-semibold text-amber-600 mb-6">
                Moves: {moveHistory.length}
              </div>
              <button
                onClick={resetGame}
                className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chess; 