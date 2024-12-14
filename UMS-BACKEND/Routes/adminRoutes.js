const express = require('express')
const Student = require('../Models/student')
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoType = require('mongoose').Types;
const auth = require('../middleware/auth')


const JWT_SECRET = 'itsNotAtoken'; 

router.post('/student', async (req, res) => {
  try {
    let studentObj = new Student({
      faculty_number: req.body.faculty_number,
      faculty_name: req.body.faculty_name,
      joining_year: req.body.joining_year,
      birth_date: req.body.birth_date,
      department: req.body.department,
      mobile: req.body.mobile,
      email: req.body.email,
      password: req.body.password,
    });

    const savedStudent = await studentObj.save(); 
    res.status(201).send(savedStudent); 
  } catch (err) {
    console.error("Error occurred while adding new student:", err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Student.findOne({ email: username, password: password });

    if (user) {
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });
      
      return res.status(200).json({ message: 'Login successful', token });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/student', async (req, res) => {
  try {

    const students = await Student.find(); 
    
    
    if (students.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(students);
  } catch (err) {
    console.error('Errorin fetching student details:', err);
    res.status(500).json({ message: 'server error' });
  }
});


router.put('/student/:id', async (req, res) => {
  try {
    console.log("hitted");
    
    if (!mongoType.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid ID format");
    }
    const { _id, ...studentData } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: studentData },
      { new: true } 
    );
    if (!updatedStudent) {
      return res.status(404).send("Student not found");
    }

    res.status(200).send(updatedStudent);

  } catch (error) {
    console.log("Error occured while updating student " + error);

  }


});

router.put('/user/:_id', auth, async (req, res) => {
  try {
    const { _id } = req.params;
    console.log("Received update request for ID:", _id);
    console.log("Request Body:", req.body);

    const existingStudent = await Student.findById(_id);
    
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    
    const {
      faculty_name,
      email,
      joining_year,
      department,
      birth_date,
      mobile,
      password
    } = req.body;

    
    const validationErrors = [];

    if (!faculty_name || faculty_name.trim().length < 2) 
      validationErrors.push('Valid Full Name is required');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
      validationErrors.push('Valid Email is required');
    
    if (!joining_year || joining_year < 1900 || joining_year > new Date().getFullYear()) 
      validationErrors.push('Valid Joining Year is required');
    
    if (!department || department.trim().length < 2) 
      validationErrors.push('Valid Department is required');
    
    if (!birth_date) 
      validationErrors.push('Birth Date is required');
    
    if (!mobile || !/^\d{10}$/.test(mobile)) validationErrors.push('Valid Mobile Number is required');
    
    if (!password || password.length < 8) 
      validationErrors.push('Password must be at least 8 characters long');

    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(', ') });
    }

    const emailExists = await Student.findOne({ 
      email, 
      _id: { $ne: _id } 
    });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    existingStudent.faculty_name = faculty_name;
    existingStudent.email = email;
    existingStudent.joining_year = joining_year;
    existingStudent.department = department;
    existingStudent.birth_date = birth_date;
    existingStudent.mobile = mobile;
    existingStudent.password = password; 

    const updatedStudent = await existingStudent.save();
    
    const studentResponse = updatedStudent.toObject();
    delete studentResponse.password; 

    res.status(200).json(studentResponse);
  } catch (error) {
    console.error("Error occurred while updating student:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/student/:id', async (req, res) => {
  try {

    if (!mongoType.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid ID format");
    }

    const updatedStudent= await Student.findByIdAndDelete(
      req.params.id);

    if (!updatedStudent) {
      return res.status(404).send("Student not found");
    }

    res.status(200).send(updatedStudent);

  } catch (error) {
    console.log("Error occured while deleting student " + error);
  }
});

router.get('/student-details',auth,async(req,res)=>{
  try {
    const student = await Student.findById(req.user.id);
    console.log(student);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

module.exports = router;