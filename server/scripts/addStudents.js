const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();

// Sample students - MODIFY THIS with your actual students
const students = [
  {
    studentId: 'CS-2021-001',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@university.edu.pk',
    department: 'Computer Science'
  },
  {
    studentId: 'CS-2021-002',
    name: 'Fatima Ali',
    email: 'fatima.ali@university.edu.pk',
    department: 'Computer Science'
  },
  {
    studentId: 'CS-2021-003',
    name: 'Hassan Raza',
    email: 'hassan.raza@university.edu.pk',
    department: 'Computer Science'
  },
  {
    studentId: 'EE-2021-001',
    name: 'Ayesha Malik',
    email: 'ayesha.malik@university.edu.pk',
    department: 'Electrical Engineering'
  },
  {
    studentId: 'EE-2021-002',
    name: 'Usman Sheikh',
    email: 'usman.sheikh@university.edu.pk',
    department: 'Electrical Engineering'
  }
];

async function addStudents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connected to MongoDB');

    // Clear existing students (OPTIONAL - remove this if you want to keep existing data)
    // await Student.deleteMany({});
    // console.log('🗑️  Cleared existing students');

    // Insert students
    const result = await Student.insertMany(students);
    console.log(`✅ Successfully added ${result.length} students`);
    
    console.log('\n📋 Added Students:');
    result.forEach(student => {
      console.log(`   - ${student.studentId}: ${student.name} (${student.email})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding students:', err.message);
    process.exit(1);
  }
}

addStudents();