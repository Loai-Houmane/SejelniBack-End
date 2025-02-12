const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailService");

const studentService = {
  signUp: async (studentData) => {
    const hashedPassword = await bcrypt.hash(studentData.password, 10);
    return await prisma.student.create({
      data: {
        ...studentData,
        password: hashedPassword,
      },
    });
  },
  updateStudent: async (id, data) => {
    return await prisma.student.update({
      where: { id: parseInt(id) },
      data,
    });
  },
  login: async (email, password) => {
    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    //Todo: change the time value
    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "60days" }
    );
    const role = student.role;
    return { token, role };
  },
  isServiceBought: async (studentId, serviceId) => {
    const existingOrder = await prisma.order.findFirst({
      where: {
        studentId: studentId,
        serviceId: serviceId,
      },
    });

    return !!existingOrder; // Return true if an order exists, otherwise false
  },
  createLead: async (studentId, agencyId) => {
    const lead = await prisma.lead.create({
      data: {
        studentId: studentId,
        agencyId: agencyId,
      },
    });

    // Fetch agency email
    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });

    // Fetch student details
    const student = await prisma.student.findUnique({ where: { id: studentId } });

    // Send email to agency
    const subject = "New Lead Created";
    const text = `A new lead has been created for your agency. Lead ID: ${lead.id}, Student: ${student.firstName + " " + student.lastName}`;
    await sendEmail(agency.email, subject, text);

    return lead;
  },

  getLeadByStudentAndAgency: async (studentId, agencyId) => {
    try {
      return await prisma.lead.findFirst({
        where: {
          studentId: studentId,
          agencyId: agencyId,
        },
      });
    } catch (error) {
      throw new Error('Error fetching lead');
    }
  },


  createOrder: async (studentId, orderData) => {
    return await prisma.order.create({
      data: {
        studentId: studentId,
        ...orderData,
      },
    });
  },

  updateOrderStatus: async (studentId, orderId, status) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.studentId !== studentId) {
      throw new Error("Order not found or unauthorized");
    }
    return await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });
  },

  searchAgencies: async (criteria) => {
    return await prisma.agency.findMany({
      where: {
        OR: [
          { name: { contains: criteria, mode: "insensitive" } },
          { services: { contains: criteria, mode: "insensitive" } },
        ],
      },
    });
  },
  IcanReview: async (studentId, agencyId) => {
    // Check if the student has already made a review for the agency
    const existingReview = await prisma.review.findUnique({
      where: {
        studentId_agencyId: {
          studentId: studentId,
          agencyId: agencyId,
        },
      },
    });

    if (existingReview) {
      return { canReview: false, message: "You have already made a review for this agency" };
    }

    // Check if the student has made an order from a service of the agency at least once
    const existingOrder = await prisma.order.findFirst({
      where: {
        studentId: studentId,
        service: {
          agencyId: agencyId,
        },
      },
    });

    if (!existingOrder) {
      return { canReview: false, message: "You must make an order from a service of the agency to send a review" };
    }

    return { canReview: true, message: "You can review this agency" };
  },


  viewOrderHistory: async (studentId) => {
    return await prisma.order.findMany({
      where: { studentId: studentId },
      include: { agency: true },
    });
  },

  bookAppointment: async (studentId, agencyId, appointmentDetails) => {
    return await prisma.appointment.create({
      data: {
        studentId: studentId,
        agencyId: agencyId,
        ...appointmentDetails,
      },
    });
  },

  updatePreferences: async (studentId, preferences) => {
    return await prisma.student.update({
      where: { id: studentId },
      data: { preferences: preferences },
    });
  },

  sendReview: async (studentId, agencyId, reviewData) => {
    // Check if the student has already made a review for the agency
    const existingReview = await prisma.review.findUnique({
      where: {
        studentId_agencyId: {
          studentId: studentId,
          agencyId: agencyId,
        },
      },
    });

    if (existingReview) {
      throw new Error("You have already made a review for this agency");
    }

    // Check if the student has made an order from a service of the agency at least once
    const existingOrder = await prisma.order.findFirst({
      where: {
        studentId: studentId,
        service: {
          agencyId: agencyId,
        },
      },
    });

    if (!existingOrder) {
      throw new Error("You must make an order from a service of the agency to send a review");
    }

    // Create the review
    return await prisma.review.create({
      data: {
        studentId: studentId,
        agencyId: agencyId,
        ...reviewData,
      },
    });
  },
  updateProfilePicture: async (studentId, profilePictureUrl) => {
    return await prisma.student.update({
      where: { id: studentId },
      data: { profilePicture: profilePictureUrl },
    });
  },

  getStudentNameAndProfile: async (id) => {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
      select: { firstName: true, lastName: true, profilePicture: true },
    });
    if (!student) {
      throw new Error("Student not found");
    }
    return {
      name: `${student.firstName} ${student.lastName}`,
      profilePicture: student.profilePicture,
    };
  },
  getStudentById: async (id) => {
    return await prisma.student.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
        role: true,
        // subscriptionDate: true,
        orders: true,
        appointments: true,
        reviews: true,

      },
    });
  },
  buySubscription: async (studentId) => {
    const newSubscriptionDate = new Date();
    return await prisma.student.update({
      where: { id: studentId },
      data: { subscriptionDate: newSubscriptionDate },
    });
  },


  isSubscriptionActive: async (studentId) => {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { subscriptionDate: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return new Date(student.subscriptionDate) >= oneYearAgo;
  },












};





module.exports = studentService;
