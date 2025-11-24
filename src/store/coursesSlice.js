import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../api/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

const initialState = {
  courses: [],
  favourites: [],
  loading: false,
  error: null,
};

/** FETCH COURSES FROM FIRESTORE */
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const courses = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));
      return courses;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadFavourites = createAsyncThunk(
  'courses/loadFavourites',
  async () => {
    const stored = await AsyncStorage.getItem('favourites');
    return stored ? JSON.parse(stored) : [];
  }
);

export const persistFavourites = createAsyncThunk(
  'courses/persistFavourites',
  async (favourites) => {
    await AsyncStorage.setItem('favourites', JSON.stringify(favourites));
    return favourites;
  }
);

/** OPTIONAL: SYNC FAVOURITES TO FIRESTORE (per user) */
export const saveFavouriteToCloud = createAsyncThunk(
  'courses/saveFavouriteToCloud',
  async ({ uid, course }, { rejectWithValue }) => {
    try {
      await setDoc(doc(db, 'users', uid, 'favourites', course.id), course);
      return course;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFavouriteFromCloud = createAsyncThunk(
  'courses/removeFavouriteFromCloud',
  async ({ uid, courseId }, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'favourites', courseId));
      return courseId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    toggleFavourite(state, action) {
      const course = action.payload;
      const exists = state.favourites.find(c => c.id === course.id);

      if (exists) {
        state.favourites = state.favourites.filter(c => c.id !== course.id);
      } else {
        state.favourites.push(course);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCourses.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload || [];
      })
      .addCase(persistFavourites.fulfilled, (state, action) => {
        state.favourites = action.payload;
      });
  },
});

export const { toggleFavourite } = coursesSlice.actions;
export default coursesSlice.reducer;
