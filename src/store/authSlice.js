import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../api/firebaseConfig";
import { db } from "../api/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

/** REGISTER */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // set display name
      await updateProfile(res.user, { displayName: name });

      // Create Firestore user doc with role
      await setDoc(doc(db, "users", res.user.uid), {
        name,
        email,
        role: "student",  // default role
      });

      const userData = {
        uid: res.user.uid,
        name: name,
        email: res.user.email,
        role: "student",
      };

      // local cache (optional)
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/** LOGIN */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // Get role from Firestore
      const userRef = doc(db, "users", res.user.uid);
      const snap = await getDoc(userRef);
      const role = snap.exists() ? snap.data().role : "user";

      const userData = {
        uid: res.user.uid,
        name: res.user.displayName || "Student",
        email: res.user.email,
        role,   // ✅ add role here
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/** KEEP LOGIN ON APP REFRESH */
export const listenToAuthChanges = createAsyncThunk(
  "auth/listenToAuthChanges",
  async (_, { dispatch }) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(setUser(null));
        await AsyncStorage.removeItem("user");
      } else {
        // Fetch role from Firestore
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const role = snap.exists() ? snap.data().role : "user";

        const userData = {
          uid: user.uid,
          name: user.displayName || "Student",
          email: user.email,
          role,
        };
        dispatch(setUser(userData));
        await AsyncStorage.setItem("user", JSON.stringify(userData));
      }
    });
  }
);

/** LOGOUT */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await signOut(auth);
  await AsyncStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
