const AgencyService = require("../services/agencyService");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const crypto = require('crypto');


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photos' || file.fieldname === 'logo') {
    // Accept only image files for photos and logo
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only PNG, JPG, and JPEG are allowed for photos and logo!'), false);
    }
  } else if (file.fieldname === 'video') {
    // Accept only video files for video
    if (file.mimetype === 'video/mp4') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only MP4 and MKV are allowed for video!'), false);
    }
  } else {
    cb(new Error('Invalid field name!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Endpoint to upload photos
exports.uploadPhotos = [
  upload.array('photos', 10), // Allow up to 10 photos
  async (req, res) => {
    try {
      const agencyId = req.user.id;
      const photoUrls = req.files.map(file => {
        return `/uploads/${file.filename}`;
      });
      const updatedAgency = await AgencyService.updateAgencyPhotos(agencyId, photoUrls);
      res.status(200).json(updatedAgency);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// Endpoint to upload video
exports.uploadVideo = [
  upload.single('video'),
  async (req, res) => {
    try {
      const agencyId = req.user.id;
      const videoUrl = `/uploads/${req.file.filename}`;
      const updatedAgency = await AgencyService.updateAgencyVideo(agencyId, videoUrl);
      res.status(200).json(updatedAgency);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// Endpoint to upload logo
exports.uploadLogo = [
  upload.single('logo'),
  async (req, res) => {
    try {
      const agencyId = req.user.id;
      const logoUrl = `/uploads/${req.file.filename}`;
      const updatedAgency = await AgencyService.updateAgencyLogo(agencyId, logoUrl);
      res.status(200).json(updatedAgency);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// Register a new agency profile
exports.registerAgency = async (req, res) => {
  try {
    const agencyData = req.body;
    const newAgency = await AgencyService.registerAgency(agencyData);
    res.status(201).json(newAgency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login an agency
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AgencyService.login(email, password);
    if (result) {
      const { id, role } = result;
      const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "60days",
      });
      res.status(200).json({ id, token, role });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing agency profile
exports.updateAgency = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const agencyData = req.body;
    const updatedAgency = await AgencyService.updateAgency(
      agencyId,
      agencyData
    );
    res.status(200).json(updatedAgency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an agency profile
exports.deleteAgency = async (req, res) => {
  try {
    const agencyId = req.user.id;
    await AgencyService.deleteAgency(agencyId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAgencyByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const agency = await AgencyService.getAgencyByUserId(userId);
    if (agency) {
      res.status(200).json(agency);
    } else {
      res.status(404).json({ message: "Agency not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get an agency by ID
exports.getAgencyById = async (req, res) => {
  try {
    const agencyId = req.params.id;
    const agency = await AgencyService.getAgencyById(agencyId);
    if (agency) {
      res.status(200).json(agency);
    } else {
      res.status(404).json({ message: "Agency not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an offer
exports.createOffer = async (req, res) => {
  try {
    const offerData = {
      ...req.body,
      agencyId: req.user.id,
    };
    const newOffer = await AgencyService.createOffer(offerData);
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing offer
exports.updateOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const offerData = req.body;
    const updatedOffer = await AgencyService.updateOffer(offerId, {
      ...offerData,
    });
    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an offer
exports.deleteOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    await AgencyService.deleteOffer(offerId);
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { status } = req.body;
    const updatedLead = await AgencyService.updateLeadStatus(leadId, status);
    res.status(200).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    await AgencyService.deleteLead(leadId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get leads by agency ID
exports.getLeadsByAgency = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const leads = await AgencyService.getLeadsByAgency(agencyId);
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a service
exports.createService = async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      agencyId: req.user.id,
    };
    const newService = await AgencyService.createService(serviceData);
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing service
exports.updateService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const serviceData = req.body;
    const updatedService = await AgencyService.updateService(serviceId, serviceData);
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await AgencyService.getAllAgencies();
    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllAgenciesAdmin = async (req, res) => {
  try {
    const agencies = await AgencyService.getAllAgenciesAdmin();
    res.status(200).json(agencies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    await AgencyService.deleteService(serviceId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get agency dashboard data
exports.getAgencyDashboard = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const dashboardData = await AgencyService.getAgencyDashboard(agencyId);
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getOrdersByAgency = async (req, res) => {
  try {
    const agencyId = req.user.id;
    const orders = await AgencyService.getOrdersByAgency(agencyId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAgencyLogo = async (req, res) => {
  try {
    const agencyId = req.params.id;
    const agency = await AgencyService.getAgencyById(agencyId);
    if (agency && agency.logoUrl) {
      res.status(200).json({ logoUrl: agency.logoUrl });
    } else {
      res.status(404).json({ message: "Logo not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByAgency = async (req, res) => {
  try {
    const { id: agencyId } = req.params;
    const reviews = await AgencyService.getReviewsByAgency(agencyId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all services by agency ID
exports.getServicesByAgency = async (req, res) => {
  try {
    const { agencyId } = req.params;
    const services = await AgencyService.getServicesByAgency(agencyId);
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
