// frontend/src/components/typing/TypingArea.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateAccuracy, calculateWPM } from '../../lib/typingUtils';
import { saveSession } from '../../store/slices/typingSlice';
import { AppDispatch, RootState } from '../../store/store';
import KeyboardVisualizer from './KeyboardVisualizer';
import StatsDisplay from './StatsDisplay';

interface TypingAreaProps {
  text: string;
  lessonId?: string;
  onComplete?: (stats: any) => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ text, lessonId, onComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [keyPresses, setKeyPresses] = useState<Record<string, any>>({});
  const [currentStats, setCurrentStats] = useState({
    wpm: 0,
    accuracy: 100,
    time: 0,
  });
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
      startTimer();
    }
    
    // Calculate errors
    let newErrors = 0;
    const maxLength = Math.min(value.length, text.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (value[i] !== text[i]) {
        newErrors++;
      }
    }
    
    setErrors(newErrors);
    setInput(value);
    
    // Track key presses for heatmap
    const lastChar = value[value.length - 1];
    if (lastChar) {
      const now = Date.now();
      const keyData = keyPresses[lastChar] || { total: 0, errors: 0, times: [] };
      
      setKeyPresses(prev => ({
        ...prev,
        [lastChar]: {
          total: keyData.total + 1,
          errors: keyData.errors + (newErrors > errors ? 1 : 0),
          times: [...keyData.times, now],
          lastPressed: now,
        }
      }));
    }
    
    // Check if completed
    if (value === text) {
      const end = Date.now();
      setEndTime(end);
      setIsCompleted(true);
      stopTimer();
      
      if (onComplete) {
        const duration = (end - startTime!) / 1000;
        const stats = calculateStats(duration, newErrors);
        onComplete(stats);
      }
    }
  };
  
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      if (startTime) {
        const elapsed = (Date.now() - startTime) / 1000;
        const stats = calculateStats(elapsed, errors);
        setCurrentStats(stats);
      }
    }, 100);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
  
  const calculateStats = useCallback((duration: number, errorCount: number) => {
    const correctChars = input.length - errorCount;
    const wpm = calculateWPM(correctChars, duration / 60);
    const accuracy = calculateAccuracy(input.length, errorCount);
    
    return { wpm, accuracy, time: duration };
  }, [input.length, errors]);
  
  const handleComplete = async () => {
    if (!startTime || !endTime) return;
    
    const duration = (endTime - startTime) / 1000;
    const correctChars = input.length - errors;
    const wpm = calculateWPM(correctChars, duration / 60);
    const accuracy = calculateAccuracy(input.length, errors);
    
    const sessionData = {
      type: lessonId ? 'LESSON' : 'PRACTICE',
      lessonId,
      duration,
      wpm,
      accuracy,
      errors,
      totalKeys: input.length,
      keyPresses,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };
    
    try {
      await dispatch(saveSession(sessionData)).unwrap();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };
  
  useEffect(() => {
    if (isCompleted) {
      handleComplete();
    }
  }, [isCompleted]);
  
  useEffect(() => {
    // Focus textarea on mount
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
    
    return () => {
      stopTimer();
    };
  }, []);
  
  const renderTextWithHighlights = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-700';
      
      if (index < input.length) {
        if (input[index] === char) {
          className = 'text-green-600';
        } else {
          className = 'text-red-600 bg-red-100';
        }
      } else if (index === input.length) {
        className = 'text-blue-600 underline';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="mb-6">
              <StatsDisplay stats={currentStats} />
            </div>
            
            <div className="mb-6">
              <div className="font-mono text-xl leading-relaxed bg-gray-50 p-6 rounded-lg min-h-[200px]">
                {renderTextWithHighlights()}
              </div>
            </div>
            
            <div className="mb-6">
              <textarea
                ref={textAreaRef}
                value={input}
                onChange={handleInputChange}
                disabled={isCompleted}
                className="w-full h-32 p-4 font-mono text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                placeholder="Start typing here..."
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={() => setInput('')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => textAreaRef.current?.focus()}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Focus
                </button>
              </div>
              
              {isCompleted && (
                <div className="text-green-600 font-semibold">
                  ✓ Completed!
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Keyboard Heatmap</h3>
            <KeyboardVisualizer 
              keyPresses={keyPresses}
              layout={user?.keyboardLayout || 'QWERTY'}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Session Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Errors:</span>
                <span className="font-semibold">{errors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Characters:</span>
                <span className="font-semibold">{input.length}/{text.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Progress:</span>
                <span className="font-semibold">
                  {((input.length / text.length) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingArea;