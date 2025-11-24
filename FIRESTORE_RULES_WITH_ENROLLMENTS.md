# Updated Firestore Security Rules with Enrollments

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

    // Global enrollments collection - only admins can read, any logged-in user can write
    match /enrollments/{enrollId} {
      allow read: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";

      allow write: if request.auth != null;
    }
  }
}
```

## What's New:

### Global Enrollments Collection
- ✅ **Write**: Any authenticated user can enroll (creates enrollment record)
- ✅ **Read**: Only admins can view all enrollments
- 🔒 Regular users cannot see other users' enrollments
- 📊 Admins get aggregated view of all course enrollments

## Dual Storage Strategy:

When a user enrolls in a course, data is written to **TWO places**:

### 1. User Subcollection (for user dashboard)
```
users/{uid}/enrollments/{courseId}
```
- User can view their own enrollments
- Powers the "Enrolled" tab in user dashboard

### 2. Global Collection (for admin dashboard)
```
enrollments/{autoDocId}
```
- Contains user info (name, email, uid)
- Contains course info (title, category, courseId)
- Timestamp for enrollment date
- Admins can query all enrollments at once

## Admin Features:

### Enrollments Tab Shows:
- 👤 Student name and email
- 📚 Enrolled course title
- 🏷️ Course category
- 📅 Enrollment date
- 📊 Total enrollment count

## Apply These Rules:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Firestore Database** → **Rules** tab
3. Replace existing rules with the code above
4. Click **Publish**

✅ Your admin can now see all user enrollments in one centralized view!
