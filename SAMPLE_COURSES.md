# Quick Firestore Setup - Sample Courses

Copy these documents to your Firebase Console manually:

## Collection: `courses`

### Document 1: `course1`
```json
{
  "title": "Introduction to Computer Science",
  "code": "CS101",
  "description": "Learn the fundamentals of computer science including programming, algorithms, and data structures. Perfect for beginners.",
  "category": "Computer Science",
  "price": 15000,
  "thumbnail": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
  "rating": 4.8,
  "students": 1250,
  "duration": "12 weeks",
  "status": "Popular"
}
```

### Document 2: `course2`
```json
{
  "title": "Web Development Bootcamp",
  "code": "WD201",
  "description": "Master HTML, CSS, JavaScript, React, Node.js and build full-stack web applications from scratch.",
  "category": "Web Development",
  "price": 25000,
  "thumbnail": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
  "rating": 4.9,
  "students": 2100,
  "duration": "16 weeks",
  "status": "Popular"
}
```

### Document 3: `course3`
```json
{
  "title": "Data Science & Machine Learning",
  "code": "DS301",
  "description": "Learn Python, data analysis, machine learning algorithms, and AI. Work with real-world datasets.",
  "category": "Data Science",
  "price": 30000,
  "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
  "rating": 4.7,
  "students": 890,
  "duration": "20 weeks",
  "status": "Popular"
}
```

### Document 4: `course4`
```json
{
  "title": "Mobile App Development",
  "code": "MA202",
  "description": "Build iOS and Android apps using React Native. Learn mobile UI/UX design and deployment.",
  "category": "Mobile Development",
  "price": 22000,
  "thumbnail": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
  "rating": 4.6,
  "students": 1450,
  "duration": "14 weeks",
  "status": "Popular"
}
```

### Document 5: `course5`
```json
{
  "title": "Digital Marketing Mastery",
  "code": "DM101",
  "description": "Master SEO, social media marketing, content strategy, and analytics to grow your business online.",
  "category": "Marketing",
  "price": 18000,
  "thumbnail": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
  "rating": 4.5,
  "students": 1680,
  "duration": "10 weeks",
  "status": "Upcoming"
}
```

---

## How to Add to Firestore:

1. Open Firebase Console
2. Go to **Firestore Database**
3. Click **Start collection**
4. Collection ID: `courses`
5. For each document above:
   - Click **Add document**
   - Document ID: use the IDs above (course1, course2, etc.)
   - Add each field with the correct type:
     - **String**: title, code, description, category, thumbnail, duration, status
     - **Number**: price, rating, students
   - Click **Save**

That's it! Your app will now fetch these courses from Firestore.
