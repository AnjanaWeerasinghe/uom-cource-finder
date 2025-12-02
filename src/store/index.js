import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import coursesReducer from './coursesSlice';
import adminReducer from './adminSlice';
import worksReducer from './worksSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    admin: adminReducer,
    works: worksReducer,
  },
});

export default store;
