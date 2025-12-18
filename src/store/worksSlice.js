import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../api/firebaseConfig";
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from "firebase/firestore";

// Teacher: Fetch their uploaded course works
export const fetchWorksByTeacher = createAsyncThunk(
  "works/fetchWorksByTeacher",
  async (teacherId) => {
    const q = query(
      collection(db, "courseWorks"),
      where("teacherId", "==", teacherId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
);

// Teacher: Add new course work
export const addCourseWork = createAsyncThunk(
  "works/addCourseWork",
  async (work) => {
    const docRef = await addDoc(collection(db, "courseWorks"), {
      ...work,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...work };
  }
);

// Teacher: Fetch student submissions for a specific work
export const fetchSubmissionsByWork = createAsyncThunk(
  "works/fetchSubmissionsByWork",
  async (workId) => {
    const q = query(
      collection(db, "submissions"),
      where("workId", "==", workId),
      orderBy("submittedAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
);

// Student: Fetch course works for an enrolled course
export const fetchWorksByCourse = createAsyncThunk(
  "works/fetchWorksByCourse",
  async (courseId) => {
    const q = query(
      collection(db, "courseWorks"),
      where("courseId", "==", courseId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
);

// Alias for fetchWorksByCourse to match TeacherCourseWorksScreen usage
export const fetchCourseWorks = fetchWorksByCourse;

// Student: Submit work
export const submitWork = createAsyncThunk(
  "works/submitWork",
  async ({ work, student, textAnswer, fileUrl }) => {
    const docRef = await addDoc(collection(db, "submissions"), {
      workId: work.id,
      workTitle: work.title,
      courseId: work.courseId,
      courseTitle: work.courseTitle,
      studentId: student.uid,
      studentName: student.name || student.email,
      studentEmail: student.email,
      textAnswer: textAnswer || "",
      fileUrl: fileUrl || "",
      submittedAt: new Date().toISOString(),
      status: "submitted",
    });
    return { id: docRef.id, workId: work.id };
  }
);

// Student: Fetch my submissions
export const fetchMySubmissions = createAsyncThunk(
  "works/fetchMySubmissions",
  async (studentId) => {
    const q = query(
      collection(db, "submissions"),
      where("studentId", "==", studentId),
      orderBy("submittedAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
);

// Teacher: Grade submission
export const gradeSubmission = createAsyncThunk(
  "works/gradeSubmission",
  async ({ submissionId, grade, feedback }) => {
    await updateDoc(doc(db, "submissions", submissionId), {
      grade,
      feedback,
      status: "graded",
      gradedAt: new Date().toISOString()
    });
    return { submissionId, grade, feedback };
  }
);

const worksSlice = createSlice({
  name: "works",
  initialState: { 
    works: [], 
    submissions: [], 
    mySubmissions: [],
    loading: false 
  },
  reducers: {
    clearSubmissions(state) {
      state.submissions = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchWorksByTeacher.pending, state => { state.loading = true; })
      .addCase(fetchWorksByTeacher.fulfilled, (state, action) => {
        state.loading = false; 
        state.works = action.payload;
      })
      .addCase(fetchWorksByCourse.fulfilled, (state, action) => {
        state.works = action.payload;
      })
      .addCase(addCourseWork.fulfilled, (state, action) => {
        state.works.unshift(action.payload);
      })
      .addCase(fetchSubmissionsByWork.fulfilled, (state, action) => {
        state.submissions = action.payload;
      })
      .addCase(fetchMySubmissions.fulfilled, (state, action) => {
        state.mySubmissions = action.payload;
      })
      .addCase(submitWork.fulfilled, (state, action) => {
        // Mark work as submitted
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        const sub = state.submissions.find(s => s.id === action.payload.submissionId);
        if (sub) {
          sub.grade = action.payload.grade;
          sub.feedback = action.payload.feedback;
          sub.status = "graded";
        }
      });
  }
});

export const { clearSubmissions } = worksSlice.actions;
export default worksSlice.reducer;
