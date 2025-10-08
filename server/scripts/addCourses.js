const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();

// All Computer Science courses with teachers
const csCourses = [
  // Semester 1
  { courseName: 'Introduction to Information and Communication Technology', teacher: 'Mr Badar Sami', semester: 1, department: 'Computer Science' },
  { courseName: 'Programming Fundamentals', teacher: 'Dr Farhan Ahmed Siddiqui', semester: 1, department: 'Computer Science' },
  { courseName: 'Applied Physics', teacher: 'Ms Faiza Maryam', semester: 1, department: 'Computer Science' },
  { courseName: 'Calculus and Analytical Geometry', teacher: 'Mr Ilyas', semester: 1, department: 'Computer Science' },
  { courseName: 'Functional English', teacher: 'Ms Farheen Shafiq', semester: 1, department: 'Computer Science' },
  { courseName: 'Islamic Studies or Ethics', teacher: 'Mr Waqar Hussain', semester: 1, department: 'Computer Science' },

  // Semester 2
  { courseName: 'Object Oriented Programming', teacher: 'Dr Humera Tariq', semester: 2, department: 'Computer Science' },
  { courseName: 'Digital Logic Design', teacher: 'Mr Bari Ahmed', semester: 2, department: 'Computer Science' },
  { courseName: 'Discrete Structures', teacher: 'Mr Mukesh Kumar Rathi', semester: 2, department: 'Computer Science' },
  { courseName: 'Linear Algebra', teacher: 'Mr Asghar Shamsi', semester: 2, department: 'Computer Science' },
  { courseName: 'Ideology and Constitution of Pakistan', teacher: 'Ms Humera Muzaffar', semester: 2, department: 'Computer Science' },
  { courseName: 'Communication and Presentation Skills', teacher: 'Mr Sami ul Huda', semester: 2, department: 'Computer Science' },

  // Semester 3
  { courseName: 'Data Structures And Algorithms', teacher: 'Ms Maryam Feroze', semester: 3, department: 'Computer Science' },
  { courseName: 'Computer Organization and Assembly Language', teacher: 'Ms Farheen Faisal', semester: 3, department: 'Computer Science' },
  { courseName: 'Software Engineering Fundamentals', teacher: 'Mr Hussain Saleem', semester: 3, department: 'Computer Science' },
  { courseName: 'Multivariable Calculus', teacher: 'Mr Ilyas', semester: 3, department: 'Computer Science' },
  { courseName: 'Probability and Statistics', teacher: 'Dr Humera Bashir', semester: 3, department: 'Computer Science' },
  { courseName: 'Urdu', teacher: 'Dr Ansar Ahmed', semester: 3, department: 'Computer Science' },

  // Semester 4
  { courseName: 'Database Management Systems', teacher: 'Dr Khalid Jamal', semester: 4, department: 'Computer Science' },
  { courseName: 'Computer Architecture', teacher: 'Mr Taha Bin Niaz', semester: 4, department: 'Computer Science' },
  { courseName: 'Theory of Automata', teacher: 'Ms Madiha Khurram', semester: 4, department: 'Computer Science' },
  { courseName: 'Software Project Management', teacher: 'Ms Maryam Feroze', semester: 4, department: 'Computer Science' },
  { courseName: 'Data Communication and Networking', teacher: 'Mr Mukesh Kumar Rathi', semester: 4, department: 'Computer Science' },
  { courseName: 'Introduction to Management', teacher: 'Ms Maryam', semester: 4, department: 'Computer Science' },

  // Semester 5
  { courseName: 'Software Engineering', teacher: 'Ms Farheen Faisal', semester: 5, department: 'Computer Science' },
  { courseName: 'Operating Systems', teacher: 'Dr Mohammad Saeed', semester: 5, department: 'Computer Science' },
  { courseName: 'Design and Analysis of Algorithms', teacher: 'Mr Taha Bin Niaz', semester: 5, department: 'Computer Science' },
  { courseName: 'Compiler Construction', teacher: 'Mr Mukarram', semester: 5, department: 'Computer Science' },
  { courseName: 'Computer Graphics', teacher: 'Dr Humera Azam', semester: 5, department: 'Computer Science' },

  // Semester 6
  { courseName: 'Artificial Intelligence', teacher: 'Dr Nadeem Mahmood', semester: 6, department: 'Computer Science' },
  { courseName: 'Advanced Software Engineering', teacher: 'Ms Farheen Faisal', semester: 6, department: 'Computer Science' },
  { courseName: 'Modelling and Simulation', teacher: 'Dr Shaista Raees', semester: 6, department: 'Computer Science' },
  { courseName: 'Parallel Computing', teacher: 'Dr Mohammad Saeed', semester: 6, department: 'Computer Science' },

  // Semester 7
  { courseName: 'Financial Accounting', teacher: 'Mr Mairaj Ahmed', semester: 7, department: 'Computer Science' },
  { courseName: 'Management Information Systems', teacher: 'Dr Asim Ali', semester: 7, department: 'Computer Science' },
  { courseName: 'Internet Application Development', teacher: 'Dr Humera Tariq', semester: 7, department: 'Computer Science' },
  { courseName: 'Network Security', teacher: 'Dr Sadiq Ali Khan', semester: 7, department: 'Computer Science' },
  { courseName: 'Data Warehousing', teacher: 'Dr Khalid Jamal', semester: 7, department: 'Computer Science' },

  // Semester 8
  { courseName: 'Distributed Database Systems', teacher: 'Dr Nadeem Mahmood', semester: 8, department: 'Computer Science' },
  { courseName: 'Neural Network and Fuzzy Logic', teacher: 'Mr Adnan Zaidi', semester: 8, department: 'Computer Science' },
  { courseName: 'Human Interaction with Computer', teacher: 'Dr Syed Asim Ali', semester: 8, department: 'Computer Science' }
];

async function addCourses() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connected to MongoDB');

    // Clear existing CS courses (optional - comment out if you want to keep existing)
    await Course.deleteMany({ department: 'Computer Science' });
    console.log('🗑️  Cleared existing Computer Science courses');

    // Insert all CS courses
    const result = await Course.insertMany(csCourses);
    console.log(`✅ Successfully added ${result.length} Computer Science courses`);
    
    console.log('\n📋 Courses by Semester:');
    for (let sem = 1; sem <= 8; sem++) {
      const semCourses = result.filter(c => c.semester === sem);
      console.log(`\n  Semester ${sem}: ${semCourses.length} courses`);
      semCourses.forEach(course => {
        console.log(`    - ${course.courseName} (${course.teacher})`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding courses:', err.message);
    process.exit(1);
  }
}

addCourses();