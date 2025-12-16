'use client';

import { Award, BookOpen, Clock, Target, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Typing Master</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Master Your Typing Skills
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of typists and practice with our modern, engaging typing platform. Improve your speed, accuracy, and compete on leaderboards.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
              <button className="px-8 py-3 bg-white text-blue-600 font-medium border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Real-time WPM tracking</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Accuracy analytics</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Performance graphs</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Badges & achievements</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Typing Master?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Structured Lessons
              </h3>
              <p className="text-gray-600 mb-4">
                Learn typing from beginner to advanced with our comprehensive lesson modules.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Progressive difficulty levels</li>
                <li>✓ Finger positioning guides</li>
                <li>✓ Technique tutorials</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Timed Tests
              </h3>
              <p className="text-gray-600 mb-4">
                Challenge yourself with timed typing tests and track your progress over time.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Multiple durations (1-10 min)</li>
                <li>✓ WPM & accuracy scoring</li>
                <li>✓ Detailed performance reports</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Analytics & Tracking
              </h3>
              <p className="text-gray-600 mb-4">
                Monitor your improvement with detailed analytics and performance graphs.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Session history</li>
                <li>✓ Performance heatmaps</li>
                <li>✓ Streak tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-blue-100">Keystrokes Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-blue-100">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Become a Typing Master?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community and start improving your typing skills today. It's free and takes less than a minute to get started.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-blue-50 transition-colors"
          >
            Start Practicing Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Typing Master. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
