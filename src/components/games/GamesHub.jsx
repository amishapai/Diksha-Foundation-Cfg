import React, { useState, useEffect } from 'react';
import { Brain, Clock, Trophy, ArrowLeft, Play, Target, Zap } from 'lucide-react';
import Game2048 from './Game2048';
import Sudoku from './Sudoku';
import Chess from './Chess';

const GamesHub = ({ onBack, userRole = 'student' }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameStats, setGameStats] = useState({});
  const [dailyPlayTime, setDailyPlayTime] = useState(0);
  const [maxDailyTime] = useState(1800); // 30 minutes max per day

  // Game configurations
  const games = [
    {
      id: '2048',
      name: '2048',
      description: 'Combine tiles to reach 2048 and improve logical thinking',
      icon: '🧩',
      timeLimit: 300, // 5 minutes
      difficulty: 'Medium',
      skills: ['Pattern Recognition', 'Strategic Planning', 'Number Logic'],
      component: Game2048
    },
    {
      id: 'sudoku',
      name: 'Sudoku',
      description: 'Fill the grid with numbers 1-9 to enhance problem-solving skills',
      icon: '🔢',
      timeLimit: 600, // 10 minutes
      difficulty: 'Medium',
      skills: ['Logical Reasoning', 'Critical Thinking', 'Concentration'],
      component: Sudoku
    },
    {
      id: 'chess',
      name: 'Chess',
      description: 'Strategic board game to develop planning and tactical thinking',
      icon: '♟️',
      timeLimit: 900, // 15 minutes
      difficulty: 'Hard',
      skills: ['Strategic Thinking', 'Planning', 'Spatial Awareness'],
      component: Chess
    }
  ];

  // Load game stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('game-stats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }

    const savedDailyTime = localStorage.getItem('daily-play-time');
    if (savedDailyTime) {
      const { date, time } = JSON.parse(savedDailyTime);
      const today = new Date().toDateString();
      if (date === today) {
        setDailyPlayTime(time);
      }
    }
  }, []);

  // Save game stats
  const saveGameStats = (gameId, stats) => {
    const newStats = {
      ...gameStats,
      [gameId]: {
        ...gameStats[gameId],
        gamesPlayed: (gameStats[gameId]?.gamesPlayed || 0) + 1,
        totalTime: (gameStats[gameId]?.totalTime || 0) + stats.timeUsed,
        bestScore: Math.max(gameStats[gameId]?.bestScore || 0, stats.score || 0),
        wins: gameStats[gameId]?.wins || 0 + (stats.won ? 1 : 0),
        lastPlayed: new Date().toISOString()
      }
    };
    setGameStats(newStats);
    localStorage.setItem('game-stats', JSON.stringify(newStats));
  };

  // Update daily play time
  const updateDailyPlayTime = (timeUsed) => {
    const newDailyTime = dailyPlayTime + timeUsed;
    setDailyPlayTime(newDailyTime);
    
    const today = new Date().toDateString();
    localStorage.setItem('daily-play-time', JSON.stringify({
      date: today,
      time: newDailyTime
    }));
  };

  // Handle game end
  const handleGameEnd = (gameId, stats) => {
    saveGameStats(gameId, stats);
    updateDailyPlayTime(stats.timeUsed);
    setSelectedGame(null);
  };

  // Check if student can play more games
  const canPlayMore = dailyPlayTime < maxDailyTime;

  // Get remaining time
  const remainingTime = maxDailyTime - dailyPlayTime;

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get game progress percentage
  const getGameProgress = (gameId) => {
    const stats = gameStats[gameId];
    if (!stats) return 0;
    
    // Calculate progress based on games played and performance
    const gamesPlayed = stats.gamesPlayed || 0;
    const wins = stats.wins || 0;
    const winRate = gamesPlayed > 0 ? wins / gamesPlayed : 0;
    
    return Math.min(100, (gamesPlayed * 10) + (winRate * 50));
  };

  // Get skill level based on performance
  const getSkillLevel = (gameId) => {
    const stats = gameStats[gameId];
    if (!stats || stats.gamesPlayed === 0) return 'Beginner';
    
    const winRate = stats.wins / stats.gamesPlayed;
    const avgTime = stats.totalTime / stats.gamesPlayed;
    
    if (winRate > 0.7 && avgTime < 300) return 'Expert';
    if (winRate > 0.5 && avgTime < 600) return 'Advanced';
    if (winRate > 0.3) return 'Intermediate';
    return 'Beginner';
  };

  if (selectedGame) {
    const game = games.find(g => g.id === selectedGame);
    const GameComponent = game.component;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="p-6">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedGame(null)}
              className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800">{game.name}</h1>
              <p className="text-slate-600">Time Limit: {formatTime(game.timeLimit)}</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>

          {/* Daily Time Remaining */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700">Daily Play Time Remaining:</span>
              </div>
              <div className={`text-lg font-bold ${remainingTime < 300 ? 'text-red-600' : 'text-green-600'}`}>
                {formatTime(remainingTime)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(dailyPlayTime / maxDailyTime) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Game Component */}
          <GameComponent 
            onGameEnd={(stats) => handleGameEnd(selectedGame, stats)}
            timeLimit={Math.min(game.timeLimit, remainingTime)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-slate-800">Educational Games Hub</h1>
          </div>
          <p className="text-slate-600 text-lg">Improve your IQ and cognitive skills through fun games!</p>
        </div>

        {/* Daily Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {formatTime(remainingTime)}
              </div>
              <div className="text-slate-600">Time Remaining Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Object.keys(gameStats).length}
              </div>
              <div className="text-slate-600">Games Played</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Object.values(gameStats).reduce((total, stats) => total + (stats.wins || 0), 0)}
              </div>
              <div className="text-slate-600">Total Wins</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Daily Progress</span>
              <span className="text-sm text-slate-600">{Math.round((dailyPlayTime / maxDailyTime) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(dailyPlayTime / maxDailyTime) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {games.map((game) => {
            const stats = gameStats[game.id] || {};
            const progress = getGameProgress(game.id);
            const skillLevel = getSkillLevel(game.id);
            const canPlay = canPlayMore && remainingTime >= game.timeLimit;

            return (
              <div key={game.id} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Game Icon and Header */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{game.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{game.description}</p>
                </div>

                {/* Game Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">{stats.gamesPlayed || 0}</div>
                    <div className="text-xs text-slate-600">Games</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{stats.wins || 0}</div>
                    <div className="text-xs text-slate-600">Wins</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">Progress</span>
                    <span className="text-xs text-slate-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Skill Level */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">{skillLevel}</span>
                </div>

                {/* Game Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Time Limit:</span>
                    <span className="font-medium">{formatTime(game.timeLimit)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Difficulty:</span>
                    <span className="font-medium">{game.difficulty}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-slate-700 mb-2">Skills Developed:</div>
                  <div className="flex flex-wrap gap-1">
                    {game.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Play Button */}
                <button
                  onClick={() => setSelectedGame(game.id)}
                  disabled={!canPlay}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    canPlay
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  {canPlay ? 'Play Now' : 'Daily Limit Reached'}
                </button>

                {!canPlay && (
                  <p className="text-xs text-red-600 text-center mt-2">
                    Come back tomorrow for more games!
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Educational Benefits */}
        <div className="bg-white rounded-2xl p-6 shadow-xl mt-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Educational Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-800 mb-2">Cognitive Enhancement</h4>
              <p className="text-sm text-slate-600">Improve memory, attention, and processing speed</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-800 mb-2">Problem Solving</h4>
              <p className="text-sm text-slate-600">Develop analytical and strategic thinking skills</p>
            </div>
            <div className="text-center">
              <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-800 mb-2">Achievement</h4>
              <p className="text-sm text-slate-600">Track progress and celebrate improvements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesHub; 