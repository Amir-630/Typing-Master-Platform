'use client';

import { ArrowRight, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';

interface Lesson {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number;
  completed: boolean;
  progress: number;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Home Row Keys',
    description: 'Learn to type the home row keys: A S D F J K L semicolon',
    level: 'beginner',
    duration: 15,
    completed: true,
    progress: 100,
  },
  {
    id: 2,
    title: 'Top Row Keys',
    description: 'Master typing the top row: Q W E R T Y U I O P',
    level: 'beginner',
    duration: 15,
    completed: true,
    progress: 100,
  },
  {
    id: 3,
    title: 'Bottom Row Keys',
    description: 'Practice the bottom row: Z X C V B N M',
    level: 'beginner',
    duration: 15,
    completed: false,
    progress: 45,
  },
  {
    id: 4,
    title: 'Numbers & Symbols',
    description: 'Learn to type numbers and common symbols efficiently',
    level: 'intermediate',
    duration: 20,
    completed: false,
    progress: 0,
  },
  {
    id: 5,
    title: 'Punctuation Mastery',
    description: 'Master all punctuation marks and special characters',
    level: 'intermediate',
    duration: 20,
    completed: false,
    progress: 0,
  },
  {
    id: 6,
    title: 'Speed Challenge',
    description: 'Push your limits with advanced typing challenges',
    level: 'advanced',
    duration: 30,
    completed: false,
    progress: 0,
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800';
    case 'advanced':
      return 'bg-purple-100 text-purple-800';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function LessonsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  const beginnerLessons = LESSONS.filter((l) => l.level === 'beginner');
  const intermediateLessons = LESSONS.filter((l) => l.level === 'intermediate');
  const advancedLessons = LESSONS.filter((l) => l.level === 'advanced');

  const renderLessonCard = (lesson: Lesson) => (
    <div
      key={lesson.id}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">{lesson.title}</h3>
          {lesson.completed ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getLevelColor(lesson.level)}`}>
            {lesson.level.charAt(0).toUpperCase() + lesson.level.slice(1)}
          </span>
          <span className="text-xs text-gray-500">⏱ {lesson.duration} min</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-900">{lesson.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${lesson.progress}%` }}
          ></div>
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
        {lesson.completed ? 'Review' : 'Start'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

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
          <span className="text-gray-700 font-medium">{user?.username}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Learn to Type</h1>
          <p className="text-xl text-gray-600">
            Follow our structured lessons to improve your typing skills from beginner to expert level.
          </p>
        </div>

        {/* Beginner Lessons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold">
              1
            </span>
            Beginner Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beginnerLessons.map(renderLessonCard)}
          </div>
        </div>

        {/* Intermediate Lessons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              2
            </span>
            Intermediate Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intermediateLessons.map(renderLessonCard)}
          </div>
        </div>

        {/* Advanced Lessons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              3
            </span>
            Advanced Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedLessons.map(renderLessonCard)}
          </div>
        </div>
      </div>
    </div>
  );
}
