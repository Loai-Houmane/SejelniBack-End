const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = async (username, password) => {
  const admin = await prisma.admin.findUnique({ where: { username } });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new Error("Invalid username or password.");
  }
  //TODO: change time
  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  return {
    token: token,
    role: admin.role
  };
};
exports.approveAgency = async (id) => {
  await prisma.agency.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED" },
  });
};

exports.rejectAgency = async (id) => {
  await prisma.agency.update({
    where: { id: parseInt(id) },
    data: { status: "REJECTED" },
  });
};

exports.suspendAgency = async (id) => {
  await prisma.agency.update({
    where: { id: parseInt(id) },
    data: { status: "SUSPENDED" },
  });
};

exports.reactivateAgency = async (id) => {
  await prisma.agency.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED" },
  });
};

exports.getDashboardStats = async () => {
  const totalStudents = await prisma.student.count();
  const activeAgencies = await prisma.agency.count({
    where: { status: "APPROVED" },
  });
  const monthlyLeads = await prisma.lead.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(1)),
      },
    },
  });
  const ongoingOrders = await prisma.order.count({
    where: { status: "PENDING" },
  });
  const completedOrders = await prisma.order.count({
    where: { status: "COMPLETED" },
  });
  const reviewsSummary = await prisma.review.groupBy({
    by: ["status"],
    _count: true,
  });

  return {
    totalStudents,
    activeAgencies,
    monthlyLeads,
    ongoingOrders,
    completedOrders,
    reviewsSummary,
  };
};

exports.approveReview = async (id) => {
  await prisma.review.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED" },
  });
};

exports.rejectReview = async (id) => {
  await prisma.review.update({
    where: { id: parseInt(id) },
    data: { status: "REJECTED" },
  });
};

exports.createArticle = async (data) => {
  return await prisma.article.create({ data });
};

exports.updateArticle = async (id, data) => {
  return await prisma.article.update({
    where: { id: parseInt(id) },
    data,
  });
};

exports.deleteArticle = async (id) => {
  await prisma.article.delete({
    where: { id: parseInt(id) },
  });
};

exports.createFilter = async (data) => {
  return await prisma.filter.create({ data });
};

exports.toggleFilterStatus = async (id) => {
  const filter = await prisma.filter.findUnique({
    where: { id: parseInt(id) },
  });
  return await prisma.filter.update({
    where: { id: parseInt(id) },
    data: { isActive: !filter.isActive },
  });
};

exports.updateFilter = async (id, data) => {
  return await prisma.filter.update({
    where: { id: parseInt(id) },
    data: data,
  });
};

exports.deleteFilter = async (id) => {
  await prisma.filter.delete({
    where: { id: parseInt(id) },
  });
};

exports.getAgencyActivities = async (id) => {
  const agency = await prisma.agency.findUnique({
    where: { id: parseInt(id) },
    include: {
      leads: true,
      reviews: true,
      offers: true,
      appointments: true,
    },
  });
  return agency;
};

exports.approveReview = async (id) => {
  await prisma.review.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED" },
  });
};

exports.rejectReview = async (id) => {
  await prisma.review.update({
    where: { id: parseInt(id) },
    data: { status: "REJECTED" },
  });
};


exports.getAllAgencies = async () => {
  return await prisma.agency.findMany();
};

exports.getAllOrders = async () => {
  return await prisma.order.findMany();
};

exports.getRecentStudents = async () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisMonthStudents = await prisma.student.count({
    where: {
      subscriptionDate: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  const lastMonthStudents = await prisma.student.count({
    where: {
      subscriptionDate: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const allStudents = await prisma.student.count({
    where: {
      subscriptionDate: {
        gte: oneYearAgo,
      },
    },
  });

  return {
    thisMonthStudents,
    lastMonthStudents,
    allStudents,
  };
};

exports.getReviewRatings = async () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const totalAvgRating = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
  });

  const thisMonthAvgRating = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  const lastMonthAvgRating = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  return {
    totalAvgRating: totalAvgRating._avg.rating,
    thisMonthAvgRating: thisMonthAvgRating._avg.rating,
    lastMonthAvgRating: lastMonthAvgRating._avg.rating,
  };
};

exports.getLeadCounts = async () => {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisMonthLeads = await prisma.lead.count({
    where: {
      createdAt: {
        gte: thisMonthStart,
        lte: thisMonthEnd,
      },
    },
  });

  const lastMonthLeads = await prisma.lead.count({
    where: {
      createdAt: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
    },
  });

  return {
    thisMonthLeads,
    lastMonthLeads,
  };
};
exports.getAllReviews = async () => {
  return await prisma.review.findMany({
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true
        }
      },
      agency: {
        select: {
          name: true
        }
      }
    }
  });
};
exports.getAllArticles = async () => {
  return await prisma.article.findMany();
};
exports.getStudentNameById = async (id) => {
  const student = await prisma.student.findUnique({
    where: { id: parseInt(id) },
    select: { firstName: true, lastName: true },
  });
  if (!student) {
    throw new Error("Student not found");
  }
  return `${student.firstName} ${student.lastName}`;
};

exports.getAgencyNameById = async (id) => {
  const agency = await prisma.agency.findUnique({
    where: { id: parseInt(id) },
    select: { name: true },
  });
  if (!agency) {
    throw new Error("Agency not found");
  }
  return agency.name;
};

exports.getArticleById = async (id) => {
  return await prisma.article.findUnique({
    where: { id: parseInt(id) },
  });
};