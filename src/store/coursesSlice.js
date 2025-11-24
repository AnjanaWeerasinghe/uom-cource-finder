import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../api/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc,
} from 'firebase/firestore';

const initialState = {
  courses: [],
  favourites: [],
  enrollments: [],
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

/** ADMIN CRUD OPERATIONS */
export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (course, { rejectWithValue }) => {
    try {
      await addDoc(collection(db, 'courses'), {
        ...course,
        price: Number(course.price || 0),
        rating: 0,
        students: 0,
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, 'courses', id), {
        ...data,
        price: Number(data.price || 0),
        updatedAt: new Date().toISOString(),
      });
      return { id, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/** USER ENROLLMENT */
export const enrollCourse = createAsyncThunk(
  'courses/enrollCourse',
  async ({ uid, course }, { rejectWithValue }) => {
    try {
      await setDoc(doc(db, 'users', uid, 'enrollments', course.id), {
        ...course,
        enrolledAt: new Date().toISOString(),
      });
      return course;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchEnrollments = createAsyncThunk(
  'courses/fetchEnrollments',
  async (uid, { rejectWithValue }) => {
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'enrollments'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
      })
      // Admin CRUD
      .addCase(addCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(c => c.id !== action.payload);
      })
      // Enrollments
      .addCase(enrollCourse.fulfilled, (state, action) => {
        if (!state.enrollments.find(e => e.id === action.payload.id)) {
          state.enrollments.push(action.payload);
        }
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.enrollments = action.payload;
      });
  },
});

export const { toggleFavourite } = coursesSlice.actions;
export default coursesSlice.reducer;
