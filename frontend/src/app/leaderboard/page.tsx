'use client';

import { Medal, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface LeaderboardUser {
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
  sessions: number;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, username: 'TypeMaster', wpm: 156, accuracy: 98.5, sessions: 324 },
  { rank: 2, username: 'SpeedDemon', wpm: 149, accuracy: 97.2, sessions: 281 },
  { rank: 3, username: 'KeyboardKing', wpm: 142, accuracy: 96.8, sessions: 256 },
  { rank: 4, username: 'FingerFlash', wpm: 138, accuracy: 96.1, sessions: 243 },
  { rank: 5, username: 'TypingNinja', wpm: 135, accuracy: 95.9, sessions: 228 },
  { rank: 6, username: 'RapidTyper', wpm: 132, accuracy: 95.4, sessions: 215 },
  { rank: 7, username: 'FastHands', wpm: 128, accuracy: 94.8, sessions: 198 },
  { rank: 8, username: 'ProTypist', wpm: 125, accuracy: 94.3, sessions: 187 },
  { rank: 9, username: 'KeySmasher', wpm: 122, accuracy: 93.7, sessions: 176 },
  { rank: 10, username: 'EliteTyper', wpm: 119, accuracy: 93.2, sessions: 165 },
];

const getMedalIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Medal className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-orange-600" />;
    default:
      return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  }
};

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'all-time'>('all-time');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Typing Master</span>
            </Link>
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-gray-700 font-medium hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/practice" className="text-gray-700 font-medium hover:text-blue-600">
                Practice
              </Link>
              <Link href="/lessons" className="text-gray-700 font-medium hover:text-blue-600">
                Lessons
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Global Leaderboard</h1>
          <p className="text-xl text-gray-600">
            Compete with typists from around the world and climb the rankings
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 flex gap-4 justify-center">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              period === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              period === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={`px-6 py-2 font-medium rounded-lg transition-colors ${
              period === 'all-time'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    WPM
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Accuracy
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Sessions
                  </th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD_DATA.map((user, index) => (
                  <tr
                    key={user.rank}
                    className={`border-b transition-colors hover:bg-blue-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {getMedalIcon(user.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-blue-600">{user.wpm}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${user.accuracy}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {user.accuracy}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-gray-600">{user.sessions}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Your Rank */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Your Current Rank</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Overall Rank</p>
              <p className="text-4xl font-bold">#128</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Your WPM</p>
              <p className="text-4xl font-bold">92</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Your Accuracy</p>
              <p className="text-4xl font-bold">96.3%</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Total Sessions</p>
              <p className="text-4xl font-bold">42</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
