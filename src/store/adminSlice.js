import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../api/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching all users...");
      const snap = await getDocs(collection(db, "users"));
      const users = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      console.log("Fetched users:", users.length);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ uid, role }, { rejectWithValue }) => {
    try {
      console.log("Updating user role:", uid, role);
      await updateDoc(doc(db, "users", uid), { role });
      return { uid, role };
    } catch (error) {
      console.error("Error updating user role:", error);
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: { 
    users: [], 
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllUsers.pending, state => { 
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false; 
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
        console.error("fetchAllUsers rejected:", action.payload);
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const user = state.users.find(x => x.uid === action.payload.uid);
        if (user) user.role = action.payload.role;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload || "Failed to update user role";
        console.error("updateUserRole rejected:", action.payload);
      });
  }
});

export default adminSlice.reducer;
