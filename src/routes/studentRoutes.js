const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authenticateJWT = require("../middleware/authMiddleware");
const isOnSubscription = require("../middleware/isOnSubscription");
//login and signup
router.post("/signup", studentController.signUp);
router.post("/login", studentController.login);
router.put("/update", authenticateJWT, studentController.updateStudent);
//Lead
router.post("/lead", authenticateJWT, studentController.createLead);

// Route to search for agencies
router.get("/search", authenticateJWT, studentController.searchAgencies);
// Route to create an order
router.post("/create-order", authenticateJWT, isOnSubscription, studentController.createOrder);

// Route to view order history
router.get("/orders-History", authenticateJWT, studentController.viewOrderHistory);

// Route to book an appointment
router.post(
  "/appointments",
  authenticateJWT,
  studentController.bookAppointment
);
router.post("/send-review", authenticateJWT, studentController.sendReview);
// Additional student-related routes can be added here
// Route to get student name and profile picture by ID
router.get("/student/:id", authenticateJWT, studentController.getStudentNameAndProfile);

// In studentRoutes.js
router.get("/me", authenticateJWT, studentController.getStudentByToken);

// Route to upload profile picture
router.post("/upload-profile-picture", authenticateJWT, studentController.uploadProfilePicture);
router.post("/can-review", authenticateJWT, studentController.IcanReview);
router.post("/is-service-bought", authenticateJWT, studentController.isServiceBought);


router.post("/buy-subscription", authenticateJWT, studentController.buySubscription);
router.get("/check-subscription", authenticateJWT, studentController.checkSubscription);
module.exports = router;
