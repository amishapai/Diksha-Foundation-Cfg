import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Clock, Check, X, AlertCircle } from 'lucide-react';

const Sudoku = ({ onGameEnd, timeLimit = 600, difficulty = 'medium' }) => { // 10 minutes default
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [originalBoard, setOriginalBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [maxMistakes] = useState(3);

  // Generate a solved Sudoku board
  const generateSolvedBoard = () => {
    const board = Array(9).fill().map(() => Array(9).fill(0));
    
    // Fill diagonal 3x3 boxes first
    for (let i = 0; i < 9; i += 4) {
      fillBox(board, i, i);
    }
    
    // Solve the rest
    solveSudoku(board);
    return board;
  };

  // Fill a 3x3 box with random numbers
  const fillBox = (board, row, col) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        board[row + i][col + j] = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
      }
    }
  };

  // Check if a number can be placed at a position
  const isValid = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    
    return true;
  };

  // Solve Sudoku using backtracking
  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Create puzzle by removing numbers
  const createPuzzle = (solvedBoard) => {
    const puzzle = solvedBoard.map(row => [...row]);
    const cellsToRemove = {
      'easy': 30,
      'medium': 40,
      'hard': 50
    };
    
    const cells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        cells.push([i, j]);
      }
    }
    
    // Shuffle and remove cells
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    
    for (let i = 0; i < cellsToRemove[difficulty]; i++) {
      const [row, col] = cells[i];
      puzzle[row][col] = 0;
    }
    
    return puzzle;
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const solvedBoard = generateSolvedBoard();
    const puzzle = createPuzzle(solvedBoard);
    
    setSolution(solvedBoard);
    setBoard(puzzle.map(row => [...row]));
    setOriginalBoard(puzzle.map(row => [...row]));
    setSelectedCell(null);
    setTimeLeft(timeLimit);
    setGameOver(false);
    setWon(false);
    setMistakes(0);
    setIsPlaying(true);
  }, [difficulty, timeLimit]);

  // Handle cell selection
  const handleCellClick = (row, col) => {
    if (!isPlaying || gameOver || originalBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  };

  // Handle number input
  const handleNumberInput = (num) => {
    if (!selectedCell || !isPlaying || gameOver) return;
    
    const { row, col } = selectedCell;
    const newBoard = board.map(row => [...row]);
    
    // Check if the number is correct
    if (solution[row][col] === num) {
      newBoard[row][col] = num;
      setBoard(newBoard);
      
      // Check if puzzle is complete
      if (isPuzzleComplete(newBoard)) {
        setWon(true);
        setGameOver(true);
        setIsPlaying(false);
      }
    } else {
      setMistakes(prev => {
        const newMistakes = prev + 1;
        if (newMistakes >= maxMistakes) {
          setGameOver(true);
          setIsPlaying(false);
        }
        return newMistakes;
      });
    }
  };

  // Check if puzzle is complete
  const isPuzzleComplete = (board) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    return true;
  };

  // Handle key presses
  const handleKeyPress = useCallback((event) => {
    if (!selectedCell || !isPlaying || gameOver) return;
    
    const key = event.key;
    if (key >= '1' && key <= '9') {
      handleNumberInput(parseInt(key));
    } else if (key === 'Backspace' || key === 'Delete') {
      const { row, col } = selectedCell;
      if (originalBoard[row][col] === 0) {
        const newBoard = board.map(row => [...row]);
        newBoard[row][col] = 0;
        setBoard(newBoard);
      }
    }
  }, [selectedCell, isPlaying, gameOver, board, originalBoard]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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

  // Game end callback
  useEffect(() => {
    if (gameOver && onGameEnd) {
      onGameEnd({ 
        won, 
        timeUsed: timeLimit - timeLeft, 
        mistakes,
        difficulty 
      });
    }
  }, [gameOver, won, timeLeft, timeLimit, mistakes, difficulty, onGameEnd]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCellClass = (row, col, value) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isOriginal = originalBoard[row][col] !== 0;
    const isInSameRow = selectedCell?.row === row;
    const isInSameCol = selectedCell?.col === col;
    const isInSameBox = Math.floor(row / 3) === Math.floor(selectedCell?.row / 3) && 
                       Math.floor(col / 3) === Math.floor(selectedCell?.col / 3);
    
    let baseClass = 'w-10 h-10 border border-gray-300 flex items-center justify-center text-lg font-semibold cursor-pointer transition-all duration-200';
    
    if (isSelected) {
      baseClass += ' bg-blue-500 text-white border-blue-600';
    } else if (isInSameRow || isInSameCol || isInSameBox) {
      baseClass += ' bg-blue-50 border-blue-200';
    } else if (isOriginal) {
      baseClass += ' bg-gray-100 text-gray-800 cursor-not-allowed';
    } else {
      baseClass += ' bg-white text-gray-800 hover:bg-gray-50';
    }
    
    // Add border styling for 3x3 boxes
    if (row % 3 === 0) baseClass += ' border-t-2 border-t-gray-400';
    if (row === 8) baseClass += ' border-b-2 border-b-gray-400';
    if (col % 3 === 0) baseClass += ' border-l-2 border-l-gray-400';
    if (col === 8) baseClass += ' border-r-2 border-r-gray-400';
    
    return baseClass;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Sudoku</h1>
          <p className="text-slate-600">Fill the grid with numbers 1-9</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Time</div>
            <div className={`text-xl font-bold ${timeLeft < 120 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Mistakes</div>
            <div className="text-xl font-bold text-red-600">
              {mistakes}/{maxMistakes}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Difficulty</div>
            <div className="text-xl font-bold text-purple-600 capitalize">
              {difficulty}
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-lg">
            <div className="text-sm text-slate-600 mb-1">Progress</div>
            <div className="text-xl font-bold text-green-600">
              {board.flat().filter(cell => cell !== 0).length}/81
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
          <div className="grid grid-cols-9 gap-0 max-w-md mx-auto">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(rowIndex, colIndex, cell)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Number Pad */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="grid grid-cols-9 gap-2 max-w-md mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                {num}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => {
                if (selectedCell) {
                  const { row, col } = selectedCell;
                  if (originalBoard[row][col] === 0) {
                    const newBoard = board.map(row => [...row]);
                    newBoard[row][col] = 0;
                    setBoard(newBoard);
                  }
                }
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={initializeGame}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-4 shadow-lg">
          <h3 className="font-semibold text-slate-800 mb-2">How to Play:</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Fill each row, column, and 3x3 box with numbers 1-9</li>
            <li>• No number can repeat in the same row, column, or box</li>
            <li>• Click a cell and use number keys or the number pad</li>
            <li>• You have {formatTime(timeLimit)} and {maxMistakes} mistakes allowed</li>
          </ul>
        </div>

        {/* Game Over Modal */}
        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
              <div className="text-6xl mb-4">
                {won ? '🏆' : mistakes >= maxMistakes ? '❌' : '⏰'}
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {won ? 'Congratulations!' : mistakes >= maxMistakes ? 'Too Many Mistakes!' : 'Time\'s Up!'}
              </h2>
              <p className="text-slate-600 mb-4">
                {won ? 'You solved the puzzle!' : 'Better luck next time!'}
              </p>
              <div className="text-lg font-semibold text-blue-600 mb-6">
                Time: {formatTime(timeLimit - timeLeft)}
              </div>
              <button
                onClick={initializeGame}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
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

export default Sudoku; 