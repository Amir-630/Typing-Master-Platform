// frontend/src/app/dashboard/page.tsx
'use client';

import {
    Award,
    BarChart as BarChartIcon,
    Clock,
    LogOut,
    Target,
    TrendingUp,
    Trophy,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Cell, Line, LineChart, Pie, PieChart } from 'recharts';
import { fetchLeaderboard } from '../../store/slices/typingSlice';
import { AppDispatch, RootState } from '../../store/store';
import { Achievement, LeaderboardEntry, TypingSession } from '../../types';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sessions, leaderboard, achievements } = useSelector(
    (state: RootState) => state.typing
  );
  
  useEffect(() => {
    dispatch(fetchLeaderboard('weekly'));
  }, [dispatch]);
  
  // Sample data for charts
  const wpmData = [
    { day: 'Mon', wpm: 45 },
    { day: 'Tue', wpm: 52 },
    { day: 'Wed', wpm: 48 },
    { day: 'Thu', wpm: 58 },
    { day: 'Fri', wpm: 55 },
    { day: 'Sat', wpm: 62 },
    { day: 'Sun', wpm: 60 },
  ];
  
  const accuracyData = [
    { name: 'Correct', value: 92, color: '#10b981' },
    { name: 'Errors', value: 8, color: '#ef4444' },
  ];
  
  const recentAchievements = achievements.slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Typing Master</span>
            </div>
            <div className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 font-medium hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                href="/practice"
                className="text-gray-700 font-medium hover:text-blue-600"
              >
                Practice
              </Link>
              <Link
                href="/lessons"
                className="text-gray-700 font-medium hover:text-blue-600"
              >
                Lessons
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">{user?.username}</span>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600 mt-2">
                Keep practicing to improve your typing skills
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {user?.level}
                </div>
                <div className="text-sm text-gray-500">Level</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {user?.currentStreak} days
                </div>
                <div className="text-sm text-gray-500">Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">
                      {user?.avgWPM?.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-500">Avg WPM</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">
                      {user?.avgAccuracy?.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">Accuracy</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">
                      {Math.floor(user?.totalTime! / 3600)}h
                    </div>
                    <div className="text-sm text-gray-500">Total Time</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold">
                      {achievements.length}
                    </div>
                    <div className="text-sm text-gray-500">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* WPM Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Weekly Performance</h3>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64">
                <LineChart width={600} height={250} data={wpmData}>
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </div>
            </div>
            
            {/* Recent Sessions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-6">Recent Sessions</h3>
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session: TypingSession) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">
                        {new Date(session.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.type} • {Math.floor(session.duration / 60)} min
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">
                          {session.wpm.toFixed(1)}
                        </div>
                        <div className="text-xs text-gray-500">WPM</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">
                          {session.accuracy.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">Accuracy</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Leaderboard & Achievements */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Weekly Leaderboard</h3>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="space-y-4">
                {leaderboard.slice(0, 5).map((entry: LeaderboardEntry, index: number) => (
                  <div
                    key={entry.id}
                    className={`flex items-center p-3 rounded-lg ${
                      entry.user.id === user?.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="font-medium">
                        {entry.user.username}
                        {entry.user.id === user?.id && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.wpm.toFixed(1)} WPM • {entry.accuracy.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Accuracy Distribution */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Accuracy Distribution</h3>
                <BarChartIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-40 flex items-center justify-center">
                <PieChart width={200} height={200}>
                  <Pie
                    data={accuracyData}
                    cx={100}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="mt-4 space-y-2">
                {accuracyData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-6">Recent Achievements</h3>
              <div className="space-y-4">
                {recentAchievements.map((achievement: Achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-sm text-gray-500">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;