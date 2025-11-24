# Firestore Security Rules

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
  }
}
```

## What These Rules Do:

### 1. **Courses Collection**
- ✅ **Read**: Anyone can view courses (even unauthenticated users)
- ✅ **Write**: Only users with `role: "admin"` in Firestore can add/edit/delete courses
- 🔒 **Security**: Rule checks the user's role from `/users/{uid}` document before allowing write

### 2. **Users Collection**
- ✅ **Read/Write**: Users can only access their own profile document
- 🔒 **Security**: Prevents users from reading or modifying other users' data

### 3. **Favourites Subcollection**
- ✅ **Read/Write**: Users can only access their own favourites
- 🔒 **Security**: Each user's favourites are isolated

---

## How to Apply:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Replace the existing rules with the code above
5. Click **Publish**

---

## Testing Security:

### ✅ Test 1: Non-admin tries to add course
```javascript
// Should FAIL with "Missing or insufficient permissions"
await addDoc(collection(db, "courses"), { title: "Test" });
```

### ✅ Test 2: Admin adds course
```javascript
// Should SUCCEED (if user doc has role: "admin")
await addDoc(collection(db, "courses"), { title: "New Course" });
```

### ✅ Test 3: User accesses own favourites
```javascript
// Should SUCCEED
const favRef = doc(db, "users", currentUser.uid, "favourites", courseId);
await setDoc(favRef, { ... });
```

### ✅ Test 4: User tries to access another user's data
```javascript
// Should FAIL
const otherUserRef = doc(db, "users", "someOtherUID");
await getDoc(otherUserRef); // Permission denied
```

---

## How to Make Yourself Admin:

1. Register a new account in your app
2. Go to Firebase Console → **Firestore Database**
3. Open the `users` collection
4. Find your user document (by your UID)
5. Edit the `role` field from `"user"` → `"admin"`
6. Save
7. **Log out and log back in** to refresh your role in Redux

✅ Now you'll see the **Admin** tab in the app!

---

## Important Notes:

⚠️ **Role is checked server-side** - Even if someone modifies the Redux state in their app, Firestore rules will still block unauthorized writes.

⚠️ **Must log in again after changing role** - The role is fetched during login and cached in Redux. If you change a user's role in Firestore, they need to log out and log back in.

⚠️ **Don't make all users admin** - Only give admin role to trusted accounts.

---

## Troubleshooting:

### "Missing or insufficient permissions" error
- ✅ Check that your rules are published
- ✅ Verify the user is logged in (`request.auth != null`)
- ✅ For admin actions, confirm the user doc has `role: "admin"`

### Admin tab not showing
- ✅ Make sure you logged out and back in after changing role
- ✅ Check Redux state: `console.log(user.role)` should be `"admin"`

### Users can't save favourites
- ✅ Ensure user is authenticated
- ✅ Check the favourites subcollection path matches: `users/{uid}/favourites/{favId}`
