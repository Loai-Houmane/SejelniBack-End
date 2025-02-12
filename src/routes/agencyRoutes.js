const express = require("express");
const router = express.Router();
const agencyController = require("../controllers/agencyController");
const authenticateJWT = require("../middleware/authMiddleware");
const checkOwnership = require("../middleware/checkOwnership");

// Route to login an agency
router.post("/login", agencyController.login);
// Route to register a new agency profile
router.post("/register", agencyController.registerAgency);
// Route to update an existing agency profile
router.put(
  "/update",
  authenticateJWT,
  agencyController.updateAgency
);
router.delete(
  "/delete/:id",
  authenticateJWT,
  checkOwnership("agency"),
  agencyController.deleteAgency
);
//get Agency by id
// Route to get an agency by ID
router.get(
  "/getAgencie/:id",
  authenticateJWT,
  agencyController.getAgencyById
);
router.get(
  "/getAgencieByUser",
  authenticateJWT,
  agencyController.getAgencyByUserId
);


// Routes for managing offers
router.post("/offer/create", authenticateJWT, agencyController.createOffer);
router.put(
  "/offer/update/:id",
  authenticateJWT,
  checkOwnership("offer"),
  agencyController.updateOffer
);
router.delete(
  "/offer/delete/:id",
  authenticateJWT,
  checkOwnership("offer"),
  agencyController.deleteOffer
);

// Route to get the agency dashboard
router.get(
  "/dashboard/:id",
  authenticateJWT,
  agencyController.getAgencyDashboard
);

// Route to manage leads for the agency
router.get("/lead/All", authenticateJWT, agencyController.getLeadsByAgency);
router.put(
  "/lead/update/:id",
  authenticateJWT,
  checkOwnership("lead"),
  agencyController.updateLeadStatus
);
router.delete(
  "/lead/delete/:id",
  authenticateJWT,
  checkOwnership("lead"),
  agencyController.deleteLead
);
// Routes for managing services
router.post("/service/create", authenticateJWT, agencyController.createService);
router.put(
  "/service/update/:id",
  authenticateJWT,
  checkOwnership("service"),
  agencyController.updateService
);
router.delete(
  "/service/delete/:id",
  authenticateJWT,
  checkOwnership("service"),
  agencyController.deleteService
);
// Route to get all services by agency ID
router.get(
  "/services/:agencyId",
  authenticateJWT,
  agencyController.getServicesByAgency
);
router.get(
  "/ordersByAgency",
  authenticateJWT,
  agencyController.getOrdersByAgency
);

// Route to upload a logo
router.post("/upload-logo", authenticateJWT, agencyController.uploadLogo);



// Routes for uploading photos and video
router.post("/upload-photos", authenticateJWT, agencyController.uploadPhotos);
router.post("/upload-video", authenticateJWT, agencyController.uploadVideo);
// Route to get the agency logo
router.get("/logo/:id", authenticateJWT,  agencyController.getAgencyLogo);
// Route to get the agency photos
router.get(
  "/reviews/:id",
  authenticateJWT,
  agencyController.getReviewsByAgency
);
router.get("/all", authenticateJWT, agencyController.getAllAgencies);
router.get("/allAdmin", authenticateJWT, agencyController.getAllAgenciesAdmin);
module.exports = router;
