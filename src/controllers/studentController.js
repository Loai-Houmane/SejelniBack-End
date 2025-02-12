const studentService = require("../services/studentService");
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

exports.uploadProfilePicture = [
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const studentId = req.user.id;
      const profilePictureUrl = `/uploads/${req.file.filename}`;
      const updatedStudent = await studentService.updateProfilePicture(studentId, profilePictureUrl);
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];
exports.signUp = async (req, res) => {
  try {
    const studentData = req.body;
    const student = await studentService.signUp(studentData);
    res.status(201).json(student);
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
};
// Login a student

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, role } = await studentService.login(email, password);
    res.status(200).json({ token, role });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid email or password", error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const { firstName, lastName } = req.body;

    const updatedStudent = await studentService.updateStudent(studentId, { firstName, lastName });
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error: error.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const { agencyId } = req.body;

    // Check if the student already has a lead with the agency
    const existingLead = await studentService.getLeadByStudentAndAgency(studentId, agencyId);
    if (existingLead) {
      return res.status(200).json({ message: "Lead already exists" });
    }

    const lead = await studentService.createLead(studentId, agencyId);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead", error });
  }
};

// Search for agencies based on criteria
exports.searchAgencies = async (req, res) => {
  try {
    const { criteria } = req.body;
    const agencies = await studentService.searchAgencies(criteria);
    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ message: "Error searching agencies", error });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const studentId = req.user.id;
    const orderData = req.body;
    const order = await studentService.createOrder(studentId, orderData);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};


// View order history for the student
exports.viewOrderHistory = async (req, res) => {
  try {
    const studentId = req.user.id;
    const orderHistory = await studentService.getOrderHistory(studentId);
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order history", error });
  }
};

// Book an appointment with an agency
exports.bookAppointment = async (req, res) => {
  try {
    const { agencyId, appointmentDetails } = req.body;
    const appointment = await studentService.bookAppointment(
      agencyId,
      appointmentDetails
    );
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error });
  }
};
exports.sendReview = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const { agencyId, rating, comment } = req.body;
    const reviewData = { rating, comment };

    const review = await studentService.sendReview(studentId, agencyId, reviewData);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error sending review", error: error.message });
  }
};

exports.getStudentNameAndProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentNameAndProfile(id);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving student data", error: error.message });
  }
};


// In studentController.js
exports.getStudentByToken = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const student = await studentService.getStudentById(studentId);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving student data", error: error.message });
  }
};

exports.IcanReview = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const { agencyId } = req.body;

    const result = await studentService.IcanReview(studentId, agencyId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error checking review eligibility", error: error.message });
  }
};

exports.isServiceBought = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const { serviceId } = req.body;

    const result = await studentService.isServiceBought(studentId, serviceId);
    res.status(200).json({ isServiceBought: result });
  } catch (error) {
    res.status(500).json({ message: "Error checking service purchase", error: error.message });
  }
};

exports.buySubscription = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const updatedStudent = await studentService.buySubscription(studentId);
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error buying subscription", error: error.message });
  }
};


exports.checkSubscription = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from token
    const isActive = await studentService.isSubscriptionActive(studentId);
    res.status(200).json({ isActive });
  } catch (error) {
    res.status(500).json({ message: "Error checking subscription", error: error.message });
  }
};