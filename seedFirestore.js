/**
 * FIRESTORE DATA SEEDER
 * 
 * This script helps you populate your Firestore database with educational courses.
 * 
 * OPTION 1: Add manually via Firebase Console
 * ============================================
 * 1. Go to Firebase Console > Firestore Database
 * 2. Create a collection called "courses"
 * 3. Add documents with these fields:
 * 
 * Document ID: course1 (or auto-generate)
 * Fields:
 *   - title: "Introduction to Computer Science"
 *   - code: "CS101"
 *   - description: "Learn the fundamentals of computer science..."
 *   - category: "Computer Science"
 *   - price: 15000
 *   - thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400"
 *   - rating: 4.8
 *   - students: 1250
 *   - duration: "12 weeks"
 *   - status: "Popular"
 * 
 * OPTION 2: Use this seed function (Node.js environment)
 * =======================================================
 * If you want to run this from Node.js (not in Expo):
 * 
 * 1. Install: npm install firebase-admin
 * 2. Download your service account key from Firebase Console
 * 3. Run this file: node seedFirestore.js
 */

// Uncomment below to use with firebase-admin in Node.js environment:
/*
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const educationalCourses = [
  {
    title: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Learn the fundamentals of computer science including programming, algorithms, and data structures. Perfect for beginners.',
    category: 'Computer Science',
    price: 15000,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    rating: 4.8,
    students: 1250,
    duration: '12 weeks',
    status: 'Popular',
  },
  {
    title: 'Web Development Bootcamp',
    code: 'WD201',
    description: 'Master HTML, CSS, JavaScript, React, Node.js and build full-stack web applications from scratch.',
    category: 'Web Development',
    price: 25000,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    rating: 4.9,
    students: 2100,
    duration: '16 weeks',
    status: 'Popular',
  },
  {
    title: 'Data Science & Machine Learning',
    code: 'DS301',
    description: 'Learn Python, data analysis, machine learning algorithms, and AI. Work with real-world datasets.',
    category: 'Data Science',
    price: 30000,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    rating: 4.7,
    students: 890,
    duration: '20 weeks',
    status: 'Popular',
  },
  // Add more courses as needed...
];

async function seedCourses() {
  try {
    const batch = db.batch();
    
    educationalCourses.forEach((course, index) => {
      const docRef = db.collection('courses').doc(`course${index + 1}`);
      batch.set(docRef, course);
    });
    
    await batch.commit();
    console.log('✅ Successfully seeded courses to Firestore!');
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  }
}

seedCourses();
*/

/**
 * QUICK SETUP STEPS:
 * ==================
 * 
 * 1. Update firebaseConfig.js with your Firebase credentials
 * 2. Go to Firebase Console > Firestore Database
 * 3. Create collection "courses"
 * 4. Add at least 3-5 course documents manually with the fields above
 * 5. Your app will automatically fetch and display them!
 * 
 * Example document structure in Firestore:
 * 
 * courses (collection)
 *   └── course1 (document)
 *       ├── title: "Introduction to Computer Science"
 *       ├── code: "CS101"
 *       ├── description: "Learn programming basics..."
 *       ├── category: "Computer Science"
 *       ├── price: 15000
 *       ├── thumbnail: "https://..."
 *       ├── rating: 4.8
 *       ├── students: 1250
 *       ├── duration: "12 weeks"
 *       └── status: "Popular"
 */

console.log('📚 Firestore Seeder Script');
console.log('See comments above for setup instructions');
