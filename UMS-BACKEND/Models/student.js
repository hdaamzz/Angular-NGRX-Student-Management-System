const mongoose = require('mongoose');

const Student = mongoose.model('Students', {
    faculty_number: { type: Number },
    faculty_name: { type: String },
    joining_year: { type: Number },
    birth_date: { type: String },
    department: { type: String },
    mobile: { type: Number },
    email: { type: String },
    password: { type: String },
});

module.exports = Student;
