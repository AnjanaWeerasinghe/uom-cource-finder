// Educational Courses API
// Mock educational courses data for UoM Course Finder

const educationalCourses = [
  {
    id: 1,
    title: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Learn the fundamentals of computer science including programming, algorithms, and data structures. Perfect for beginners.',
    category: 'Computer Science',
    price: 15000,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    rating: 4.8,
    students: 1250,
    duration: '12 weeks',
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    code: 'WD201',
    description: 'Master HTML, CSS, JavaScript, React, Node.js and build full-stack web applications from scratch.',
    category: 'Web Development',
    price: 25000,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    rating: 4.9,
    students: 2100,
    duration: '16 weeks',
  },
  {
    id: 3,
    title: 'Data Science & Machine Learning',
    code: 'DS301',
    description: 'Learn Python, data analysis, machine learning algorithms, and AI. Work with real-world datasets.',
    category: 'Data Science',
    price: 30000,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    rating: 4.7,
    students: 890,
    duration: '20 weeks',
  },
  {
    id: 4,
    title: 'Mobile App Development',
    code: 'MA202',
    description: 'Build iOS and Android apps using React Native. Learn mobile UI/UX design and deployment.',
    category: 'Mobile Development',
    price: 22000,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    rating: 4.6,
    students: 1450,
    duration: '14 weeks',
  },
  {
    id: 5,
    title: 'Digital Marketing Mastery',
    code: 'DM101',
    description: 'Master SEO, social media marketing, content strategy, and analytics to grow your business online.',
    category: 'Marketing',
    price: 18000,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    rating: 4.5,
    students: 1680,
    duration: '10 weeks',
  },
  {
    id: 6,
    title: 'Graphic Design Fundamentals',
    code: 'GD101',
    description: 'Learn Adobe Photoshop, Illustrator, and design principles. Create stunning visual content.',
    category: 'Design',
    price: 16000,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    rating: 4.7,
    students: 950,
    duration: '8 weeks',
  },
  {
    id: 7,
    title: 'Business Management & Strategy',
    code: 'BM301',
    description: 'Develop leadership skills, strategic thinking, and learn business operations management.',
    category: 'Business',
    price: 28000,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    rating: 4.6,
    students: 720,
    duration: '18 weeks',
  },
  {
    id: 8,
    title: 'Cybersecurity Essentials',
    code: 'CY201',
    description: 'Learn network security, ethical hacking, cryptography, and protect systems from cyber threats.',
    category: 'Cybersecurity',
    price: 26000,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    rating: 4.8,
    students: 1120,
    duration: '15 weeks',
  },
  {
    id: 9,
    title: 'Cloud Computing with AWS',
    code: 'CC301',
    description: 'Master Amazon Web Services, cloud architecture, deployment, and DevOps practices.',
    category: 'Cloud Computing',
    price: 32000,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    rating: 4.9,
    students: 850,
    duration: '12 weeks',
  },
  {
    id: 10,
    title: 'English for Academic Purposes',
    code: 'EN101',
    description: 'Improve your academic writing, reading comprehension, and presentation skills in English.',
    category: 'Language',
    price: 12000,
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
    rating: 4.4,
    students: 1890,
    duration: '8 weeks',
  },
  {
    id: 11,
    title: 'Financial Accounting',
    code: 'AC201',
    description: 'Learn accounting principles, financial statements, budgeting, and financial analysis.',
    category: 'Accounting',
    price: 20000,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    rating: 4.5,
    students: 670,
    duration: '12 weeks',
  },
  {
    id: 12,
    title: 'UI/UX Design Masterclass',
    code: 'UX301',
    description: 'Design user-centered interfaces, conduct user research, and create wireframes and prototypes.',
    category: 'Design',
    price: 24000,
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400',
    rating: 4.8,
    students: 1340,
    duration: '10 weeks',
  },
  {
    id: 13,
    title: 'Database Management Systems',
    code: 'DB201',
    description: 'Master SQL, database design, normalization, and work with MySQL, PostgreSQL, and MongoDB.',
    category: 'Database',
    price: 19000,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400',
    rating: 4.6,
    students: 980,
    duration: '11 weeks',
  },
  {
    id: 14,
    title: 'Project Management Professional',
    code: 'PM301',
    description: 'Learn Agile, Scrum, project planning, risk management, and prepare for PMP certification.',
    category: 'Management',
    price: 27000,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    rating: 4.7,
    students: 790,
    duration: '14 weeks',
  },
  {
    id: 15,
    title: 'Artificial Intelligence & Deep Learning',
    code: 'AI401',
    description: 'Advanced AI concepts, neural networks, TensorFlow, and build intelligent applications.',
    category: 'Artificial Intelligence',
    price: 35000,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    rating: 4.9,
    students: 560,
    duration: '20 weeks',
  },
  {
    id: 16,
    title: 'Video Production & Editing',
    code: 'VP101',
    description: 'Learn video shooting, editing with Premiere Pro, color grading, and create professional content.',
    category: 'Media Production',
    price: 21000,
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
    rating: 4.6,
    students: 1230,
    duration: '9 weeks',
  },
  {
    id: 17,
    title: 'Blockchain & Cryptocurrency',
    code: 'BC301',
    description: 'Understand blockchain technology, smart contracts, DeFi, and cryptocurrency trading.',
    category: 'Blockchain',
    price: 29000,
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    rating: 4.5,
    students: 640,
    duration: '13 weeks',
  },
  {
    id: 18,
    title: 'Psychology & Human Behavior',
    code: 'PS201',
    description: 'Explore cognitive psychology, behavioral science, and understand human decision-making.',
    category: 'Psychology',
    price: 17000,
    thumbnail: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=400',
    rating: 4.7,
    students: 1540,
    duration: '12 weeks',
  },
  {
    id: 19,
    title: 'Entrepreneurship & Startup',
    code: 'EN301',
    description: 'Learn how to start a business, develop business plans, fundraising, and scale your startup.',
    category: 'Entrepreneurship',
    price: 23000,
    thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    rating: 4.8,
    students: 890,
    duration: '10 weeks',
  },
  {
    id: 20,
    title: 'Mathematics for Engineers',
    code: 'MA201',
    description: 'Advanced calculus, linear algebra, differential equations, and mathematical modeling.',
    category: 'Mathematics',
    price: 22000,
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
    rating: 4.6,
    students: 740,
    duration: '16 weeks',
  },
];

// Simulate API call
export const getCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(educationalCourses);
    }, 1000);
  });
};

export const getCourseById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const course = educationalCourses.find((c) => c.id === id);
      resolve(course);
    }, 500);
  });
};

export const searchCourses = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = educationalCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.description.toLowerCase().includes(query.toLowerCase()) ||
          course.category.toLowerCase().includes(query.toLowerCase()) ||
          course.code.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 800);
  });
};

export const getCoursesByCategory = async (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = educationalCourses.filter(
        (course) => course.category.toLowerCase() === category.toLowerCase()
      );
      resolve(results);
    }, 800);
  });
};
