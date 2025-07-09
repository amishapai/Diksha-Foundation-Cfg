import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Clock, Trophy } from 'lucide-react';

const Game2048 = ({ onGameEnd, timeLimit = 300 }) => { // 5 minutes default
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  // Initialize the game board
  const initializeBoard = useCallback(() => {
    const newBoard = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }, []);

  // Add a random tile (2 or 4) to the board
  const addRandomTile = (board) => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // Move tiles in a specific direction
  const moveTiles = (board, direction) => {
    const newBoard = board.map(row => [...row]);
    let moved = false;
    let points = 0;

    const moveRow = (row) => {
      const filtered = row.filter(cell => cell !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          points += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < 4) {
        filtered.push(0);
      }
      return filtered;
    };

    const moveColumn = (col) => {
      const filtered = col.filter(cell => cell !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          points += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < 4) {
        filtered.push(0);
      }
      return filtered;
    };

    switch (direction) {
      case 'up':
        for (let j = 0; j < 4; j++) {
          const col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
          const newCol = moveColumn(col);
          for (let i = 0; i < 4; i++) {
            if (newBoard[i][j] !== newCol[i]) {
              moved = true;
              newBoard[i][j] = newCol[i];
            }
          }
        }
        break;
      case 'down':
        for (let j = 0; j < 4; j++) {
          const col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]].reverse();
          const newCol = moveColumn(col).reverse();
          for (let i = 0; i < 4; i++) {
            if (newBoard[i][j] !== newCol[i]) {
              moved = true;
              newBoard[i][j] = newCol[i];
            }
          }
        }
        break;
      case 'left':
        for (let i = 0; i < 4; i++) {
          const newRow = moveRow(newBoard[i]);
          for (let j = 0; j < 4; j++) {
            if (newBoard[i][j] !== newRow[j]) {
              moved = true;
              newBoard[i][j] = newRow[j];
            }
          }
        }
        break;
      case 'right':
        for (let i = 0; i < 4; i++) {
          const newRow = moveRow(newBoard[i].reverse()).reverse();
          for (let j = 0; j < 4; j++) {
            if (newBoard[i][j] !== newRow[j]) {
              moved = true;
              newBoard[i][j] = newRow[j];
            }
          }
        }
        break;
      default:
        break;
    }

    if (moved) {
      addRandomTile(newBoard);
      setScore(prev => prev + points);
    }

    return { newBoard, moved };
  };

  // Check if game is over
  const checkGameOver = (board) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
      }
    }

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i][j];
        if (
          (i < 3 && board[i + 1][j] === current) ||
          (j < 3 && board[i][j + 1] === current)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  // Check if player won (reached 2048)
  const checkWin = (board) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 2048) return true;
      }
    }
    return false;
  };

  // Handle key presses
  const handleKeyPress = useCallback((event) => {
    if (!isPlaying || gameOver) return;

    let direction = '';
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      default:
        return;
    }

    event.preventDefault();
    const { newBoard, moved } = moveTiles(board, direction);
    
    if (moved) {
      setBoard(newBoard);
      
      if (checkWin(newBoard) && !won) {
        setWon(true);
      }
      
      if (checkGameOver(newBoard)) {
        setGameOver(true);
        setIsPlaying(false);
      }
    }
  }, [board, isPlaying, gameOver, won]);

  // Handle touch/swipe events for mobile
  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (event) => {
    if (!touchStart) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) handleKeyPress({ key: 'ArrowRight', preventDefault: () => {} });
      else handleKeyPress({ key: 'ArrowLeft', preventDefault: () => {} });
    } else {
      if (deltaY > 0) handleKeyPress({ key: 'ArrowDown', preventDefault: () => {} });
      else handleKeyPress({ key: 'ArrowUp', preventDefault: () => {} });
    }
  };

  // Initialize game
  useEffect(() => {
    setBoard(initializeBoard());
    setIsPlaying(true);
  }, [initializeBoard]);

  // Handle keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  // Update best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('2048-best-score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Game end callback
  useEffect(() => {
    if (gameOver && onGameEnd) {
      onGameEnd({ score, won, timeUsed: timeLimit - timeLeft });
    }
  }, [gameOver, score, won, timeLeft, timeLimit, onGameEnd]);

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setTimeLeft(timeLimit);
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTileColor = (value) => {
    const colors = {
      2: 'bg-emerald-200 text-emerald-800',
      4: 'bg-emerald-300 text-emerald-800',
      8: 'bg-teal-200 text-teal-800',
      16: 'bg-teal-300 text-teal-800',
      32: 'bg-blue-200 text-blue-800',
      64: 'bg-blue-300 text-blue-800',
      128: 'bg-purple-200 text-purple-800',
      256: 'bg-purple-300 text-purple-800',
      512: 'bg-orange-200 text-orange-800',
      1024: 'bg-orange-300 text-orange-800',
      2048: 'bg-yellow-200 text-yellow-800'
    };
    return colors[value] || 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">2048</h1>
          <p className="text-slate-600">Combine tiles to reach 2048!</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Score</div>
            <div className="text-2xl font-bold text-emerald-600">{score}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Best</div>
            <div className="text-2xl font-bold text-emerald-600">{bestScore}</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1 flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              Time
            </div>
            <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-emerald-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="bg-white rounded-2xl p-6 shadow-xl mb-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-4 gap-3">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                    cell === 0
                      ? 'bg-gray-100'
                      : `${getTileColor(cell)} shadow-md`
                  }`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h3 className="font-semibold text-slate-800 mb-2">How to Play:</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Use arrow keys or swipe to move tiles</li>
            <li>• Combine same numbers to create larger ones</li>
            <li>• Reach 2048 to win!</li>
            <li>• You have {formatTime(timeLimit)} to play</li>
          </ul>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="text-6xl mb-4">
                {won ? '🏆' : '⏰'}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {won ? 'Congratulations!' : 'Time\'s Up!'}
              </h2>
              <p className="text-slate-600 mb-4">
                {won ? 'You reached 2048!' : 'Your time has expired.'}
              </p>
              <div className="text-lg font-semibold text-emerald-600 mb-6">
                Final Score: {score}
              </div>
              <button
                onClick={resetGame}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors"
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

export default Game2048; 