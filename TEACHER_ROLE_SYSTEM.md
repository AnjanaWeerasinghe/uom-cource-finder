# Teacher Role System - Implementation Guide

## Overview
The UoM Course Finder app now includes a comprehensive teacher role system with three user roles: **Admin**, **Teacher**, and **Student**. This system allows teachers to upload coursework, students to submit assignments, and provides a complete workflow for course management.

## User Roles

### 1. Admin
**Capabilities:**
- Manage all courses (CRUD operations)
- View all enrollments
- **Manage user roles** - Promote users to teacher or admin
- Access user management dashboard

**Dashboard Tabs:**
- Manage (Courses)
- Enrollments
- Users (NEW)
- Profile

### 2. Teacher
**Capabilities:**
- Upload course works with deadlines
- View student submissions
- Grade submissions with feedback
- Browse courses

**Dashboard Tabs:**
- Works (Course Works)
- Courses (Browse)
- Profile

### 3. Student
**Capabilities:**
- Browse and enroll in courses
- View course works for enrolled courses
- Submit coursework (text answers and file URLs)
- Track submission status and grades
- View all submissions in one place

**Dashboard Tabs:**
- Home (Landing page with calendar)
- Courses (Browse)
- Favourites
- Enrolled
- Submissions (NEW)
- Profile

## New Features

### Admin Features

#### User Management Screen
- View all registered users
- Display user statistics (admin/teacher/student counts)
- Role management buttons:
  - Make Student
  - Make Teacher
  - Make Admin
- Search and filter users by role
- Color-coded role badges
- Prevents admins from changing their own role

**Access:** Admin Dashboard → Users Tab

### Teacher Features

#### 1. Course Works Dashboard (TeacherHomeScreen)
- View all created course works
- Shows course title, description, and due date
- Quick access to view submissions
- Create new course work button

**Access:** Teacher Dashboard → Works Tab

#### 2. Add Course Work (AddWorkScreen)
- Select course from enrolled courses
- Enter work title and description
- Set due date with DateTimePicker
- Optional file URL attachment
- Creates work in Firestore

**Access:** Teacher Dashboard → Works Tab → + Button

#### 3. View Submissions (WorkSubmissionsScreen)
- View all student submissions for a course work
- Statistics: Total, Graded, Pending counts
- Student information with avatars
- Submission details:
  - Text answers
  - Attached files
  - Submission date
- Grade submissions with feedback
- Status badges (Graded/Pending)
- Edit existing grades

**Access:** Teacher Dashboard → Works Tab → Select Work → View Submissions

### Student Features

#### 1. Course Works (CourseWorksScreen)
- View all course works for enrolled courses
- Filter by course
- Work details:
  - Title, description, teacher name
  - Due date with overdue indicator
  - Submission status
- Statistics: Total, Submitted, Pending
- Quick access to submit work

**Access:** Enrolled Course → Details → View Course Works Button

#### 2. Submit Work (SubmitWorkScreen)
- View assignment details and requirements
- Course and teacher information
- Due date with overdue warnings
- Submission form:
  - Text answer (required)
  - File URL (optional, e.g., Google Drive link)
- View existing submission if already submitted
- See grade and feedback if graded

**Access:** Course Works → Select Work → Submit Work Button

#### 3. My Submissions (MySubmissionsScreen)
- View all coursework submissions across all courses
- Statistics: Total, Graded, Pending
- Submission cards showing:
  - Course and work title
  - Submission date
  - Status (Graded/Pending)
  - Grade and feedback (if graded)
- Status indicators:
  - Green badge: Graded
  - Orange badge: Pending

**Access:** Student Dashboard → Submissions Tab

## Database Structure

### Firestore Collections

#### 1. courseWorks/{workId}
```javascript
{
  courseId: string,
  courseTitle: string,
  teacherId: string,
  teacherName: string,
  title: string,
  description: string,
  dueDate: timestamp,
  fileUrl: string (optional),
  createdAt: timestamp
}
```

#### 2. submissions/{submissionId}
```javascript
{
  courseId: string,
  workId: string,
  workTitle: string,
  studentId: string,
  studentName: string,
  studentEmail: string,
  textAnswer: string,
  fileUrl: string (optional),
  submittedAt: timestamp,
  status: "submitted" | "graded",
  grade: string (optional),
  feedback: string (optional),
  gradedAt: timestamp (optional)
}
```

#### 3. users/{uid}
```javascript
{
  email: string,
  displayName: string,
  role: "admin" | "teacher" | "student",
  createdAt: timestamp
}
```

## Redux State Management

### New Slices

#### 1. adminSlice
**Thunks:**
- `fetchAllUsers()` - Fetch all registered users
- `updateUserRole({ uid, role })` - Update a user's role

**State:**
```javascript
{
  users: [],
  loading: boolean
}
```

#### 2. worksSlice
**Teacher Thunks:**
- `fetchWorksByTeacher(teacherId)` - Get all works by teacher
- `addCourseWork({ courseId, courseTitle, teacherId, teacherName, title, description, dueDate, fileUrl })` - Create new work
- `fetchSubmissionsByWork(workId)` - Get all submissions for a work
- `gradeSubmission({ submissionId, grade, feedback })` - Grade a submission

**Student Thunks:**
- `fetchWorksByCourse(courseId)` - Get all works for a course
- `submitWork({ courseId, workId, workTitle, studentId, studentName, studentEmail, textAnswer, fileUrl })` - Submit work
- `fetchMySubmissions(studentId)` - Get all submissions by student

**State:**
```javascript
{
  works: [],
  submissions: [],
  mySubmissions: [],
  loading: boolean
}
```

## Navigation Structure

### Role-Based Routing
The app now uses three separate tab navigators based on user role:

```javascript
if (user.role === "admin") return <AdminTabs />
if (user.role === "teacher") return <TeacherTabs />
return <StudentTabs /> // student role
```

### New Screens Added to Navigation
- `AddWork` - Teacher creates course work
- `WorkSubmissions` - Teacher views/grades submissions
- `CourseWorks` - Student views available works
- `SubmitWork` - Student submits work
- `UserManagement` - Admin manages user roles

## Firestore Security Rules

The `firestore.rules` file implements comprehensive security:

### Key Rules:
1. **Courses:** Read by all, write by admin only
2. **Users:** 
   - Read own document
   - Admin can read all and update roles
   - Users cannot change their own role
3. **Course Works:** 
   - Read by all authenticated users
   - Create by teachers and admins
   - Update/delete by owner or admin
4. **Submissions:**
   - Students read their own
   - Teachers/admins read all
   - Create by students (own submissions only)
   - Update by teachers (for grading) or students (before grading)

**Deploy rules:**
```bash
firebase deploy --only firestore:rules
```

## Workflow Examples

### Admin Promotes User to Teacher
1. Admin opens Users tab
2. Finds user in the list
3. Clicks "Make Teacher" button
4. User's role updates in Firestore
5. User sees Teacher dashboard on next login

### Teacher Creates Course Work
1. Teacher opens Works tab
2. Clicks + button
3. Selects course from chips
4. Enters title, description, due date
5. Submits form
6. Work appears in teacher's list
7. Students see work in CourseWorks screen

### Student Submits Work
1. Student enrolls in course
2. Opens course details
3. Clicks "View Course Works"
4. Selects a work to submit
5. Fills text answer and optional file URL
6. Submits work
7. Sees submission in MySubmissions tab

### Teacher Grades Submission
1. Teacher opens Works tab
2. Selects a work
3. Clicks "View Submissions"
4. Sees list of student submissions
5. Clicks "Grade Submission"
6. Enters grade and feedback
7. Student sees grade in SubmitWork screen and MySubmissions

## Testing Checklist

### Admin Flow
- [ ] Create test accounts (students/teachers)
- [ ] Access User Management screen
- [ ] Change user roles
- [ ] Verify role changes persist after logout/login

### Teacher Flow
- [ ] Login as teacher
- [ ] See Works tab in dashboard
- [ ] Create new course work
- [ ] View submissions (if any)
- [ ] Grade a submission
- [ ] Edit a grade

### Student Flow
- [ ] Login as student
- [ ] Enroll in a course
- [ ] Click "View Course Works"
- [ ] Submit work with text answer
- [ ] Check MySubmissions tab
- [ ] View graded submission with feedback

### Cross-Role Testing
- [ ] Admin creates course
- [ ] Teacher creates work for that course
- [ ] Student enrolls and submits work
- [ ] Teacher grades submission
- [ ] Student sees grade
- [ ] Admin can view all users and enrollments

## Future Enhancements

### Potential Features
1. **File Upload Integration**
   - Direct file uploads to Firebase Storage
   - Support for multiple file types
   - File preview functionality

2. **Rich Text Editor**
   - Markdown support for work descriptions
   - Formatted feedback from teachers

3. **Notifications**
   - Push notifications for new course works
   - Alerts when work is graded
   - Deadline reminders

4. **Analytics Dashboard**
   - Teacher: Submission rates, average grades
   - Student: Progress tracking, grade trends
   - Admin: Platform usage statistics

5. **Discussion Forum**
   - Q&A section for each course work
   - Student-teacher communication
   - Peer collaboration

6. **Batch Operations**
   - Grade multiple submissions at once
   - Export grades to CSV
   - Bulk role assignments

## Troubleshooting

### Common Issues

**Issue:** User doesn't see Teacher tabs after role change
- **Solution:** Logout and login again to refresh user data

**Issue:** Student can't submit work
- **Solution:** Ensure student is enrolled in the course and work exists

**Issue:** Teacher can't see submissions
- **Solution:** Verify students have actually submitted work for that specific courseWork

**Issue:** Firestore permission denied errors
- **Solution:** Deploy security rules: `firebase deploy --only firestore:rules`

**Issue:** Role changes not working
- **Solution:** Check Firestore console to verify user document has correct role field

## Files Modified/Created

### New Files
- `src/store/adminSlice.js` - Admin Redux slice
- `src/store/worksSlice.js` - Coursework Redux slice
- `src/screens/Admin/UserManagementScreen.js` - Admin user management
- `src/screens/Teacher/TeacherHomeScreen.js` - Teacher dashboard
- `src/screens/Teacher/AddWorkScreen.js` - Create course work
- `src/screens/Teacher/WorkSubmissionsScreen.js` - View/grade submissions
- `src/screens/User/CourseWorksScreen.js` - Student course works list
- `src/screens/User/SubmitWorkScreen.js` - Submit coursework
- `src/screens/User/MySubmissionsScreen.js` - Student submissions list
- `firestore.rules` - Firestore security rules

### Modified Files
- `src/store/index.js` - Added adminReducer and worksReducer
- `src/store/authSlice.js` - Changed default role to "student"
- `src/navigation/RootNavigator.js` - Added TeacherTabs and role-based routing
- `src/screens/DetailsScreen.js` - Added "View Course Works" button for students

## Support

For issues or questions about the teacher role system:
1. Check this README first
2. Review Firestore security rules
3. Verify user roles in Firestore console
4. Check Redux state in React DevTools
5. Test with different user accounts (admin/teacher/student)
