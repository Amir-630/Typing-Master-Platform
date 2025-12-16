// frontend/src/hooks/useSoundFeedback.ts
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const useSoundFeedback = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const soundEnabled = authState.user?.soundEnabled || false;
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      correctSoundRef.current = new Audio('/sounds/correct.mp3');
      errorSoundRef.current = new Audio('/sounds/error.mp3');
    }
  }, []);
  
  const playCorrectSound = () => {
    if (soundEnabled && correctSoundRef.current) {
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play();
    }
  };
  
  const playErrorSound = () => {
    if (soundEnabled && errorSoundRef.current) {
      errorSoundRef.current.currentTime = 0;
      errorSoundRef.current.play();
    }
  };
  
  return { playCorrectSound, playErrorSound };
};

export default useSoundFeedback;