import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../api/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async () => {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ uid, role }) => {
    await updateDoc(doc(db, "users", uid), { role });
    return { uid, role };
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: { 
    users: [], 
    loading: false 
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllUsers.pending, state => { 
        state.loading = true; 
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false; 
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, state => {
        state.loading = false;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const user = state.users.find(x => x.uid === action.payload.uid);
        if (user) user.role = action.payload.role;
      });
  }
});

export default adminSlice.reducer;
