# Updated Firestore Security Rules

Copy these rules to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Courses collection - everyone can read, only admins can write
    match /courses/{courseId} {
      allow read: if true;

      allow write: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }

    // Users collection - users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User favourites - users can only access their own favourites
    match /users/{userId}/favourites/{favId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // User enrollments - users can only access their own enrollments
    match /users/{userId}/enrollments/{enrollId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## What's New:

### Enrollments Subcollection
- ✅ Each user can read/write their own enrollments at `/users/{uid}/enrollments`
- 🔒 Users cannot see other users' enrollments
- ✅ This allows the "Enroll Now" feature to work securely

## Complete Feature Set:

### 👤 User Features:
1. **Search Courses** - Real-time search by title, description, category, or code
2. **Browse Courses** - View all available courses
3. **Favourites** - Save courses for later (synced to cloud)
4. **Enroll** - Enroll in courses and track progress
5. **View Enrollments** - See all enrolled courses in dedicated tab

### 👨‍💼 Admin Features:
1. **Add Courses** - Create new courses with full details
2. **Edit Courses** - Update course information
3. **Delete Courses** - Remove courses (with confirmation)
4. **Manage Dashboard** - View all courses with edit/delete actions

## Role-Based Navigation:

- **Admin users see**: Manage Courses tab + Profile tab
- **Regular users see**: Home + Favourites + Enrolled + Profile tabs
- Both roles get Details screen for viewing course info
- Admin-only screens: AddCourse, EditCourse (stack screens)

## How It Works:

1. **Register** → Automatically gets `role: "user"` in Firestore
2. **Make Admin** → Manually change role to `"admin"` in Firestore console
3. **Login** → App reads role and shows appropriate navigation
4. **Security** → Firestore rules enforce permissions server-side

✅ Your app is now a complete course management system with role-based access control!
