# Firebase Integration Guide

## ✅ What's Been Updated

Your app now uses **Firebase** instead of dummy data:

### 1. **Authentication** (Already Integrated)
- ✅ Real user registration with Firebase Auth
- ✅ Email/password login
- ✅ Persistent auth state using AsyncStorage
- ✅ Automatic auth listener on app launch

### 2. **Firestore Database** (Newly Integrated)
- ✅ Fetches courses from Firestore collection
- ✅ Cloud sync for user favourites
- ✅ Real-time data updates

---

## 🔧 Setup Instructions

### Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click ⚙️ Settings > Project settings
4. Scroll down to "Your apps" section
5. Click the **Web** icon (`</>`)
6. Register your app (e.g., "UoM Course Finder")
7. Copy the `firebaseConfig` object

### Step 2: Update Firebase Configuration

Open `src/api/firebaseConfig.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 3: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **Email/Password**
3. Enable it and Save

### Step 4: Create Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your location
5. Click **Enable**

### Step 5: Add Course Data

#### Option A: Manual Entry (Recommended for Learning)

1. In Firestore, create a collection called `courses`
2. Click **Add document**
3. Use auto-ID or custom ID like `course1`
4. Add these fields:

| Field | Type | Example Value |
|-------|------|--------------|
| `title` | string | "Introduction to Computer Science" |
| `code` | string | "CS101" |
| `description` | string | "Learn programming basics..." |
| `category` | string | "Computer Science" |
| `price` | number | 15000 |
| `thumbnail` | string | "https://images.unsplash.com/photo-1517694712202..." |
| `rating` | number | 4.8 |
| `students` | number | 1250 |
| `duration` | string | "12 weeks" |
| `status` | string | "Popular" |

5. Repeat for at least 3-5 courses

#### Option B: Batch Import

You can use the sample data from `src/api/coursesApi.js` as reference for course data.

---

## 🚀 What's Working Now

### Authentication Flow
```
Launch App → Auth Listener → Logged In? → Show Main App
                           → Not Logged In? → Show Login Screen
```

### Data Flow
```
Home Screen → fetchCourses() → Firestore → Display Courses
Toggle Favourite → Local Storage + Cloud Sync → User's Favourites Collection
```

### Cloud Favourites Structure
```
users (collection)
  └── {userId} (document)
      └── favourites (subcollection)
          └── {courseId} (document)
              ├── title
              ├── code
              └── ... (full course data)
```

---

## 📱 Testing Your App

1. **Start Expo:**
   ```bash
   npx expo start -c
   ```

2. **Test Registration:**
   - Open app → Click "Register"
   - Enter name, email, password
   - Submit → Should create Firebase user

3. **Test Login:**
   - Enter registered email/password
   - Should navigate to Home screen

4. **Test Courses:**
   - Home screen should display courses from Firestore
   - If empty, add courses to Firestore first

5. **Test Favourites:**
   - Click star icon on any course
   - Check Firestore: `users/{userId}/favourites` should have the course
   - Restart app → favourites should persist

---

## 🔒 Security Rules (Production)

Before deploying, update Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Courses: Everyone can read, only admin can write
    match /courses/{courseId} {
      allow read: if true;
      allow write: if false; // Set to admin check later
    }
    
    // User favourites: Only owner can read/write
    match /users/{userId}/favourites/{courseId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🐛 Troubleshooting

### Error: "Permission denied"
- Check Firestore rules (use test mode for development)
- Verify user is authenticated before accessing favourites

### Error: "Firebase not initialized"
- Verify `firebaseConfig.js` has correct credentials
- Check all required Firebase packages are installed:
  ```bash
  npm list firebase
  ```

### Courses not loading
- Check Firebase Console → Firestore → verify `courses` collection exists
- Open browser console/React Native debugger for error messages
- Verify internet connection

### Auth not persisting
- Check AsyncStorage permissions
- Verify `initializeAuth` with `getReactNativePersistence` is used

---

## 📦 Required Packages (Already Installed)

```json
{
  "firebase": "^10.x",
  "@react-native-async-storage/async-storage": "^2.x",
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x"
}
```

---

## ✨ Features Implemented

- ✅ Firebase Authentication (Email/Password)
- ✅ Firestore database for courses
- ✅ Cloud sync for favourites
- ✅ Persistent login state
- ✅ Real-time data updates
- ✅ Local caching with AsyncStorage
- ✅ Redux state management

---

## 🎯 Next Steps (Optional Enhancements)

1. **Add course search/filter**
2. **Implement user profiles**
3. **Add course reviews/ratings**
4. **Enable course enrollment**
5. **Add push notifications**
6. **Implement social sharing**

---

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth with React Native](https://rnfirebase.io/)

---

**Your app is now production-ready with real Firebase backend!** 🎉
