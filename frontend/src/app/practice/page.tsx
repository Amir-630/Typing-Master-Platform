'use client';

import { Clock, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatsDisplay } from '../../components/typing/StatsDisplay';
import { calculateAccuracy, calculateWPM } from '../../lib/typingUtils';
import { AppDispatch, RootState } from '../../store/store';

const SAMPLE_TEXTS = [
  'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it useful for testing typewriters and computer keyboards.',
  'Learning to type faster is a skill that takes practice and dedication. With consistent effort, anyone can improve their typing speed and accuracy significantly over time.',
  'Technology continues to evolve at a rapid pace, transforming how we work, communicate, and live. The future will bring even more innovations that we can hardly imagine today.',
  'Reading is one of the most valuable skills you can develop. It opens doors to new worlds, ideas, and perspectives that enrich your understanding of life.',
];

interface TypingStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  correctChars: number;
  errorChars: number;
}

export default function PracticePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [currentText, setCurrentText] = useState(SAMPLE_TEXTS[0]);
  const [userInput, setUserInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    correctChars: 0,
    errorChars: 0,
  });
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [user]);

  useEffect(() => {
    if (isActive && timeElapsed < 300) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timeElapsed >= 300) {
      handleStop();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeElapsed]);

  useEffect(() => {
    if (userInput.length > 0 && !isActive) {
      setIsActive(true);
    }

    // Calculate stats
    const correct = userInput
      .split('')
      .filter((char, idx) => char === currentText[idx]).length;
    const errors = userInput.length - correct;
    const wpm = calculateWPM(correct, timeElapsed);
    const accuracy = calculateAccuracy(correct, userInput.length);

    setStats({
      wpm,
      accuracy,
      timeElapsed,
      correctChars: correct,
      errorChars: errors,
    });
  }, [userInput, timeElapsed, currentText]);

  const handleReset = () => {
    setUserInput('');
    setTimeElapsed(0);
    setIsActive(false);
    const newTextIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    setCurrentText(SAMPLE_TEXTS[newTextIndex]);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleChangeText = () => {
    const newTextIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    setCurrentText(SAMPLE_TEXTS[newTextIndex]);
    handleReset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">TM</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Typing Practice</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <StatsDisplay label="WPM" value={stats.wpm.toFixed(1)} />
          <StatsDisplay label="Accuracy" value={`${stats.accuracy.toFixed(1)}%`} />
          <StatsDisplay label="Time" value={`${stats.timeElapsed}s`} />
          <StatsDisplay label="Errors" value={stats.errorChars.toString()} />
        </div>

        {/* Main Typing Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {/* Sample Text Display */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-lg leading-relaxed text-gray-800">
              {currentText.split('').map((char, idx) => {
                let className = 'text-gray-400';
                if (idx < userInput.length) {
                  className =
                    userInput[idx] === char
                      ? 'text-green-600 font-semibold'
                      : 'text-red-600 font-semibold bg-red-50';
                } else if (idx === userInput.length) {
                  className = 'text-blue-600 font-bold animate-pulse';
                }
                return (
                  <span key={idx} className={className}>
                    {char}
                  </span>
                );
              })}
            </p>
          </div>

          {/* Typing Input */}
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Start typing here..."
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none font-mono text-base"
            disabled={timeElapsed >= 300}
          />

          {/* Controls */}
          <div className="flex gap-4 mt-8 justify-center">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </button>
            <button
              onClick={handleChangeText}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Change Text
            </button>
            {timeElapsed > 0 && isActive && (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Clock className="h-5 w-5" />
                Stop
              </button>
            )}
          </div>

          {timeElapsed >= 300 && (
            <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Test Complete!</h3>
              <p className="text-gray-700 mb-4">
                Final WPM: <span className="font-bold text-blue-600">{stats.wpm.toFixed(1)}</span>
              </p>
              <p className="text-gray-700">
                Accuracy: <span className="font-bold text-blue-600">{stats.accuracy.toFixed(1)}%</span>
              </p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tips for Better Typing</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Keep your hands on the home row (ASDFGH) for faster typing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Don't look at your keyboard - focus on the text to type</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Accuracy is more important than speed initially</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span>Practice regularly for consistent improvement</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
