const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");


const updateAgencyPhotos = async (id, photoUrls) => {
  const agency = await prisma.agency.findUnique({
    where: { id: parseInt(id, 10) },
    select: { photoGallery: true },
  });

  const updatedPhotoGallery = [...agency.photoGallery, ...photoUrls];

  return await prisma.agency.update({
    where: { id: parseInt(id, 10) },
    data: { photoGallery: updatedPhotoGallery },
  });
};
const updateAgencyVideo = async (id, videoUrl) => {
  return await prisma.agency.update({
    where: { id: parseInt(id, 10) },
    data: { videoUrl: videoUrl },
  });
};

const registerAgency = async (agencyData) => {
  const hashedPassword = await bcrypt.hash(agencyData.password, 10);
  return await prisma.agency.create({
    data: {
      ...agencyData,
      password: hashedPassword,
    },
  });
};

const login = async (email, password) => {
  const agency = await prisma.agency.findUnique({
    where: { email },
  });
  if (agency && (await bcrypt.compare(password, agency.password))) {
    return { id: agency.id, role: agency.role };
  }
  return null;
};
const updateAgencyLogo = async (id, logoUrl) => {
  return await prisma.agency.update({
    where: { id: parseInt(id, 10) },
    data: { logoUrl: logoUrl },
  });
};
const updateAgency = async (id, agencyData) => {
  // Remove the id field from agencyData if it exists
  const { id: _, countries, photoGallery, ...data } = agencyData;

  return await prisma.agency.update({
    where: { id: parseInt(id, 10) },
    data: {
      ...data,
      countries: countries.split(',').map(country => country.trim()), // Convert countries to an array of strings
      photoGallery: photoGallery.split(',').map(photo => photo.trim()), // Convert photoGallery to an array of strings
    },
  });
};
const getAgencyById = async (id) => {
  return await prisma.agency.findUnique({
    where: { id: parseInt(id, 10) },
  });
};
const createOffer = async (offerData) => {
  return await prisma.offer.create({
    data: offerData,
  });
};

const updateOffer = async (id, offerData) => {
  return await prisma.offer.update({
    where: { id: parseInt(id, 10) },
    data: offerData,
  });
};

const deleteAgency = async (id) => {
  return await prisma.agency.delete({
    where: { id: parseInt(id, 10) },
  });
};

const deleteOffer = async (id) => {
  return await prisma.offer.delete({
    where: { id: parseInt(id, 10) },
  });
};

const updateLeadStatus = async (leadId, status) => {
  return await prisma.lead.update({
    where: { id: parseInt(leadId, 10) },
    data: { status },
  });
};

const deleteLead = async (leadId) => {
  return await prisma.lead.delete({
    where: { id: parseInt(leadId, 10) },
  });
};

const getAgencyDashboard = async (agencyId) => {
  const agency = await prisma.agency.findUnique({
    where: { id: parseInt(agencyId, 10) },
    include: {
      leads: true,
      orders: true,
    },
  });
  return agency;
};
const getLeadsByAgency = async (agencyId) => {
  return await prisma.lead.findMany({
    where: { agencyId: parseInt(agencyId, 10) },
  });
};

const getServiceById = async (id) => {
  return await prisma.services.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

const getOfferById = async (id) => {
  return await prisma.offer.findUnique({
    where: { id: parseInt(id, 10) },
  });
};

const getLeadById = async (id) => {
  return await prisma.lead.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

const createService = async (serviceData) => {
  return await prisma.services.create({
    data: serviceData,
  });
};

const updateService = async (id, serviceData) => {
  return await prisma.services.update({
    where: {
      id: parseInt(id, 10) // Convert id to an integer
    },
    data: {
      ...serviceData,
      price: parseFloat(serviceData.price), // Convert price to Float
    }
  });
};
const getAllAgencies = async () => {
  const agencies = await prisma.agency.findMany({
    where: {
      status: 'APPROVED',
    },
  });

  return await Promise.all(agencies.map(async agency => {
    const totalReviews = await prisma.review.count({
      where: { agencyId: agency.id },
    });

    const totalOrders = await prisma.order.count({
      where: {
        service: {
          agencyId: agency.id,
        },
      },
    });

    const avgRating = totalReviews > 0
      ? (await prisma.review.aggregate({
        where: { agencyId: agency.id },
        _avg: { rating: true },
      }))._avg.rating
      : 0;

    return {
      ...agency,
      avgRating,
      totalReviews,
      totalOrders,
    };
  }));
};
const getAllAgenciesAdmin = async () => {
  const agencies = await prisma.agency.findMany({
  });

  return await Promise.all(agencies.map(async agency => {
    const totalReviews = await prisma.review.count({
      where: { agencyId: agency.id },
    });

    const totalOrders = await prisma.order.count({
      where: {
        service: {
          agencyId: agency.id,
        },
      },
    });

    const avgRating = totalReviews > 0
      ? (await prisma.review.aggregate({
          where: { agencyId: agency.id },
          _avg: { rating: true },
        }))._avg.rating
      : 0;

    return {
      ...agency,
      avgRating,
      totalReviews,
      totalOrders,
    };
  }));
};
const deleteService = async (id) => {
  // Delete related orders first
  await prisma.order.deleteMany({
    where: { serviceId: parseInt(id, 10) },
  });

  // Then delete the service
  return await prisma.services.delete({
    where: { id: parseInt(id, 10) },
  });
};

const getOrdersByAgency = async (agencyId) => {
  return await prisma.order.findMany({
    where: {
      service: {
        agencyId: parseInt(agencyId, 10),
      },
    },
    include: {
      service: true,
      student: true,
    },
  });
};

const getReviewsByAgency = async (agencyId) => {
  return await prisma.review.findMany({
    where: {
      agencyId: parseInt(agencyId, 10),
      status: "APPROVED"
    },
  });
};

const getServicesByAgency = async (agencyId) => {
  return await prisma.services.findMany({
    where: { agencyId: parseInt(agencyId, 10) },
  });
};

const getAgencyByUserId = async (userId) => {
  return await prisma.agency.findUnique({
    where: { id: userId },
  });
};

module.exports = {
  registerAgency,
  login,
  updateAgency,
  createOffer,
  getAgencyDashboard,
  updateOffer,
  deleteOffer,
  updateLeadStatus,
  deleteLead,
  getOfferById,
  deleteAgency,
  getLeadById,
  getLeadsByAgency,
  createService,
  updateService,
  deleteService,
  getServiceById,
  getOrdersByAgency,
  updateAgencyPhotos,
  updateAgencyVideo,
  getAgencyById,
  updateAgencyLogo,
  getReviewsByAgency,
  getServicesByAgency,
  getAgencyByUserId,
  getAllAgencies,
  getAllAgenciesAdmin,
};