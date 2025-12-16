// frontend/src/store/slices/typingSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/api';
import { TypingSession, Lesson, Achievement, LeaderboardEntry } from '../../types';

interface TypingState {
  currentSession: TypingSession | null;
  sessions: TypingSession[];
  lessons: Lesson[];
  currentLesson: Lesson | null;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TypingState = {
  currentSession: null,
  sessions: [],
  lessons: [],
  currentLesson: null,
  achievements: [],
  leaderboard: [],
  isLoading: false,
  error: null,
};

export const saveSession = createAsyncThunk(
  'typing/saveSession',
  async (sessionData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/sessions', sessionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to save session');
    }
  }
);

export const fetchLessons = createAsyncThunk(
  'typing/fetchLessons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/lessons');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch lessons');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'typing/fetchLeaderboard',
  async (period: 'daily' | 'weekly' | 'all-time', { rejectWithValue }) => {
    try {
      const response = await api.get(`/leaderboard/${period}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch leaderboard');
    }
  }
);

const typingSlice = createSlice({
  name: 'typing',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<TypingSession | null>) => {
      state.currentSession = action.payload;
    },
    setCurrentLesson: (state, action: PayloadAction<Lesson | null>) => {
      state.currentLesson = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.unshift(action.payload);
        state.currentSession = action.payload;
      })
      .addCase(saveSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.lessons = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      });
  },
});

export const { setCurrentSession, setCurrentLesson, clearError } = typingSlice.actions;
export default typingSlice.reducer;