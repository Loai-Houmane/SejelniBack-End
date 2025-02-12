const adminService = require("../services/adminService");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { token, role } = await adminService.login(username, password);
    res.status(200).json({ token, role });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.approveAgency = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.approveAgency(id);
    res.status(200).send("Agency approved");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.rejectAgency = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.rejectAgency(id);
    res.status(200).send("Agency rejected");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.suspendAgency = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.suspendAgency(id);
    res.status(200).send("Agency suspended");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.reactivateAgency = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.reactivateAgency(id);
    res.status(200).send("Agency reactivated");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.approveReview = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.approveReview(id);
    res.status(200).send("Review approved");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.rejectReview = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.rejectReview(id);
    res.status(200).send("Review rejected");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createArticle = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id; // Assuming the token payload contains the admin's ID as 'id'

    const articleData = {
      ...req.body,
      adminId: adminId,
    };

    const article = await adminService.createArticle(articleData);
    res.status(201).json(article);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await adminService.updateArticle(id, req.body);
    res.status(200).json(article);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.deleteArticle(id);
    res.status(200).send("Article deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.createFilter = async (req, res) => {
  try {
    const filter = await adminService.createFilter(req.body);
    res.status(201).json(filter);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.toggleFilterStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const filter = await adminService.toggleFilterStatus(id);
    res.status(200).json(filter);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateFilter = async (req, res) => {
  const { id } = req.params;
  try {
    const filter = await adminService.updateFilter(id, req.body);
    res.status(200).json(filter);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.deleteFilter = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.deleteFilter(id);
    res.status(200).send("Filter deleted");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAgencyActivities = async (req, res) => {
  const { id } = req.params;
  try {
    const activities = await adminService.getAgencyActivities(id);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.approveReview = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.approveReview(id);
    res.status(200).send("Review approved");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.rejectReview = async (req, res) => {
  const { id } = req.params;
  try {
    await adminService.rejectReview(id);
    res.status(200).send("Review rejected");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await adminService.getAllAgencies();
    res.status(200).json(agencies);
    //deubg
    // console.log(agencies);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await adminService.getAllOrders();
    // console.log(orders);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.getRecentStudents = async (req, res) => {
  try {
    const { thisMonthStudents,
      lastMonthStudents,
      allStudents } = await adminService.getRecentStudents();
    res.status(200).json({
      thisMonthStudents,
      lastMonthStudents,
      allStudents
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getReviewRatings = async (req, res) => {
  try {
    const ratings = await adminService.getReviewRatings();
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getLeadCounts = async (req, res) => {
  try {
    const { thisMonthLeads, lastMonthLeads } = await adminService.getLeadCounts();
    res.status(200).json({
      thisMonthLeads,
      lastMonthLeads,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await adminService.getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await adminService.getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getStudentNameById = async (req, res) => {
  const { id } = req.params;
  try {
    const studentName = await adminService.getStudentNameById(id);
    res.status(200).json({ studentName });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAgencyNameById = async (req, res) => {
  const { id } = req.params;
  try {
    const agencyName = await adminService.getAgencyNameById(id);
    res.status(200).json({ agencyName });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await adminService.getArticleById(id);
    res.status(200).json(article);
  } catch (error) {
    res.status(500).send(error.message);
  }
};