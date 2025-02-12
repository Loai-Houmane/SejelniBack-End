const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminMiddleware");

//login
router.post("/login", adminController.login);
//Agency
router.post("/approve-agency/:id", adminAuth, adminController.approveAgency);
router.post("/reject-agency/:id", adminAuth, adminController.rejectAgency);
router.post("/suspend-agency/:id", adminAuth, adminController.suspendAgency);
router.post(
  "/reactivate-agency/:id",
  adminAuth,
  adminController.reactivateAgency
);
//Dashboard
router.get("/dashboard-stats", adminAuth, adminController.getDashboardStats);
//Review
router.post("/approve-review/:id", adminAuth, adminController.approveReview);
router.post("/reject-review/:id", adminAuth, adminController.rejectReview);
//Article
router.post("/create-article", adminAuth, adminController.createArticle);
router.put("/update-article/:id", adminAuth, adminController.updateArticle);
router.delete("/delete-article/:id", adminAuth, adminController.deleteArticle);
router.get("/articles", adminAuth, adminController.getAllArticles);

//Filters
router.post("/create-filter", adminAuth, adminController.createFilter);
router.put(
  "/toggle-filter-status/:id",
  adminAuth,
  adminController.toggleFilterStatus
);
router.put(
  "/update-filter/:id",
  adminAuth,
  adminController.updateFilter
);

router.delete("/delete-filter/:id", adminAuth, adminController.deleteFilter);
//Agency Activities
router.get(
  "/agency-activities/:id",
  adminAuth,
  adminController.getAgencyActivities
);
//Review
router.post("/approve-review/:id", adminAuth, adminController.approveReview);
router.post("/reject-review/:id", adminAuth, adminController.rejectReview);
module.exports = router;



//! additionnal routes
//Get all agencies
router.get("/agencies", adminAuth, adminController.getAllAgencies);
//Get all commands
// Get all orders
router.get("/orders", adminAuth, adminController.getAllOrders);
// Get all students
router.get("/subscribedStudents", adminAuth, adminController.getRecentStudents);
router.get("/review-ratings", adminAuth, adminController.getReviewRatings);
router.get("/lead-counts", adminAuth, adminController.getLeadCounts);
router.get("/reviews", adminAuth, adminController.getAllReviews);
// Get student name by ID
router.get("/student-name/:id", adminAuth, adminController.getStudentNameById);

// Get agency name by ID
router.get("/agency-name/:id", adminAuth, adminController.getAgencyNameById);

router.get("/article/:id", adminController.getArticleById);