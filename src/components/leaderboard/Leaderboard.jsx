import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users } from 'lucide-react';
import { students, academicRecords } from '../data/studentsData';

const Leaderboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('overall');
  const [isLoading, setIsLoading] = useState(true);

  // Calculate leaderboard data from real academic records
  const leaderboardData = useMemo(() => {
    // Group records by student and calculate performance
    const studentPerformance = students.map(student => {
      const studentRecords = academicRecords.filter(record => record.studentId === student.id);
      
      if (studentRecords.length === 0) {
        return {
          id: student.id,
          name: student.name,
          rollNumber: student.rollNumber,
          class: student.className,
          percentage: 0,
          subjects: 0,
          rank: 0,
          improvement: "0%",
          avatar: student.name.split(' ').map(n => n[0]).join(''),
          examCount: 0,
          averagePercentage: 0
        };
      }

      // Calculate overall performance
      const totalPercentage = studentRecords.reduce((sum, record) => sum + record.overallPercentage, 0);
      const averagePercentage = totalPercentage / studentRecords.length;
      
      // Calculate improvement (difference between latest and earliest exam)
      const sortedRecords = studentRecords.sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
      const improvement = sortedRecords.length > 1 
        ? sortedRecords[sortedRecords.length - 1].overallPercentage - sortedRecords[0].overallPercentage
        : 0;
      
      // Get unique subjects
      const uniqueSubjects = new Set();
      studentRecords.forEach(record => {
        record.subjects.forEach(subject => uniqueSubjects.add(subject.name));
      });

      return {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        class: student.className,
        percentage: Math.round(averagePercentage * 10) / 10,
        subjects: uniqueSubjects.size,
        rank: 0, // Will be set after sorting
        improvement: `${improvement > 0 ? '+' : ''}${Math.round(improvement * 10) / 10}%`,
        avatar: student.name.split(' ').map(n => n[0]).join(''),
        examCount: studentRecords.length,
        averagePercentage: averagePercentage
      };
    });

    // Filter based on selected period
    let filteredData = studentPerformance;
    if (selectedPeriod === 'monthly') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      filteredData = studentPerformance.map(student => {
        const studentRecords = academicRecords.filter(record => 
          record.studentId === student.id &&
          new Date(record.examDate).getMonth() === currentMonth &&
          new Date(record.examDate).getFullYear() === currentYear
        );
        
        if (studentRecords.length === 0) {
          return {
            ...student,
            percentage: 0,
            improvement: "0%",
            examCount: 0
          };
        }

        const totalPercentage = studentRecords.reduce((sum, record) => sum + record.overallPercentage, 0);
        const averagePercentage = totalPercentage / studentRecords.length;
        
        return {
          ...student,
          percentage: Math.round(averagePercentage * 10) / 10,
          examCount: studentRecords.length
        };
      });
    }

    // Sort by percentage and assign ranks
    const sortedData = filteredData
      .filter(student => student.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)
      .map((student, index) => ({
        ...student,
        rank: index + 1
      }));

    return sortedData;
  }, [selectedPeriod]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-6 h-6 text-emerald-500" />;
    }
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700 text-white";
      default:
        return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white";
    }
  };

  const getImprovementColor = (improvement) => {
    return improvement.startsWith('+') ? 'text-green-600' : 'text-red-600';
  };

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (leaderboardData.length === 0) {
      return {
        topPerformers: 0,
        averageScore: 0,
        avgImprovement: 0
      };
    }

    const totalPercentage = leaderboardData.reduce((sum, student) => sum + student.percentage, 0);
    const averageScore = Math.round(totalPercentage / leaderboardData.length * 10) / 10;
    
    const improvements = leaderboardData.map(student => {
      const improvementStr = student.improvement.replace('%', '');
      return parseFloat(improvementStr);
    });
    const avgImprovement = Math.round(improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length * 10) / 10;

    return {
      topPerformers: leaderboardData.length,
      averageScore,
      avgImprovement: avgImprovement > 0 ? `+${avgImprovement}%` : `${avgImprovement}%`
    };
  }, [leaderboardData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-emerald-200 rounded-lg mb-6 w-1/3"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-20 bg-emerald-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🏆 Student Leaderboard
          </h1>
          <p className="text-slate-600 text-lg">
            Celebrating academic excellence and outstanding performance
          </p>
        </div>

        {/* Main Leaderboard Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Period Selector */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <Trophy className="w-8 h-8 text-yellow-300" />
                <h2 className="text-2xl font-bold text-white">Top Performers</h2>
              </div>
              
              <div className="flex bg-white/20 rounded-xl p-1">
                <button
                  onClick={() => setSelectedPeriod('overall')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedPeriod === 'overall'
                      ? 'bg-white text-emerald-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Overall
                </button>
                <button
                  onClick={() => setSelectedPeriod('monthly')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedPeriod === 'monthly'
                      ? 'bg-white text-emerald-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="p-6">
            {leaderboardData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-slate-600 text-lg">No performance data available for the selected period.</p>
                <p className="text-slate-500 mt-2">Add some student marks to see the leaderboard.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboardData.map((student, index) => (
                  <div
                    key={student.id}
                    className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-emerald-100 hover:border-emerald-200"
                  >
                    {/* Rank Badge */}
                    <div className="absolute -top-2 -left-2">
                      <div className={`${getRankBadge(student.rank)} w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}>
                        {student.rank}
                      </div>
                    </div>

                    <div className="p-6 pl-16">
                      <div className="flex items-center justify-between">
                        {/* Student Info */}
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {student.avatar}
                            </div>
                            <div className="absolute -bottom-1 -right-1">
                              {getRankIcon(student.rank)}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                              {student.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>Roll: {student.rollNumber}</span>
                              <span>•</span>
                              <span>{student.class}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {student.subjects} subjects
                              </span>
                              <span>•</span>
                              <span>{student.examCount} exams</span>
                            </div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="text-right">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-emerald-600">
                                {student.percentage}%
                              </div>
                              <div className="text-sm text-slate-500">Average Score</div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-5 h-5 text-emerald-500" />
                              <span className={`font-semibold ${getImprovementColor(student.improvement)}`}>
                                {student.improvement}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-emerald-300 transition-all duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{overallStats.topPerformers}</div>
                <div className="text-sm text-slate-600">Top Performers</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{overallStats.averageScore}%</div>
                <div className="text-sm text-slate-600">Average Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">{overallStats.avgImprovement}</div>
                <div className="text-sm text-slate-600">Avg Improvement</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm">
            Leaderboard updates automatically • Based on actual student performance data
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 