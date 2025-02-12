const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create Admins
  const admins = [];
  for (let i = 0; i < 5; i++) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const admin = await prisma.admin.create({
      data: {
        username: faker.internet.username(),
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    admins.push(admin);
  }

  // Create Agencies
  const agencies = [];
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const agency = await prisma.agency.create({
      data: {
        name: faker.company.name(),
        email: faker.internet.email(),
        password: hashedPassword,
        description: faker.company.catchPhrase(),
        countries: [faker.location.country()],
        contactInfo: faker.phone.number(),
        videoUrl: faker.internet.url(),
        photoGallery: [faker.image.url(), faker.image.url()],
        status: 'PENDING',
      },
    });
    agencies.push(agency);
  }

  // Create Students
  const students = [];
  for (let i = 0; i < 20; i++) {
    const hashedPassword = await bcrypt.hash('password', 10);
    const student = await prisma.student.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: hashedPassword,
        subscriptionDate: faker.date.past(),
      },
    });
    students.push(student);
  }

  // Create Services
  const services = [];
  for (let i = 0; i < 30; i++) {
    const service = await prisma.services.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        agencyId: agencies[Math.floor(Math.random() * agencies.length)].id,
      },
    });
    services.push(service);
  }

  // Create Orders
  const orders = [];
  for (let i = 0; i < 50; i++) {
    const studentId = students[Math.floor(Math.random() * students.length)].id;
    const serviceId = services[Math.floor(Math.random() * services.length)].id;

    // Check if the combination of studentId and serviceId already exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        studentId_serviceId: {
          studentId: studentId,
          serviceId: serviceId,
        },
      },
    });

    if (!existingOrder) {
      const order = await prisma.order.create({
        data: {
          studentId: studentId,
          serviceId: serviceId,
          serviceDetails: faker.lorem.sentence(),
          status: 'PENDING',
        },
      });
      orders.push(order);
    }
  }

  // Create Leads
  const leads = [];
  for (let i = 0; i < 40; i++) {
    const studentId = students[Math.floor(Math.random() * students.length)].id;
    const agencyId = agencies[Math.floor(Math.random() * agencies.length)].id;

    // Check if the combination of studentId and agencyId already exists
    const existingLead = await prisma.lead.findUnique({
      where: {
        studentId_agencyId: {
          studentId: studentId,
          agencyId: agencyId,
        },
      },
    });

    if (!existingLead) {
      const lead = await prisma.lead.create({
        data: {
          studentId: studentId,
          agencyId: agencyId,
          status: 'NEW',
        },
      });
      leads.push(lead);
    }
  }

  // Create Reviews
  const reviews = [];
  for (let i = 0; i < 30; i++) {
    const studentId = students[Math.floor(Math.random() * students.length)].id;
    const agencyId = agencies[Math.floor(Math.random() * agencies.length)].id;

    // Check if the combination of studentId and agencyId already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        studentId_agencyId: {
          studentId: studentId,
          agencyId: agencyId,
        },
      },
    });

    if (!existingReview) {
      const review = await prisma.review.create({
        data: {
          studentId: studentId,
          agencyId: agencyId,
          rating: faker.number.float({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
          status: 'PENDING',
        },
      });
      reviews.push(review);
    }
  }

  // Create Offers
  const offers = [];
  for (let i = 0; i < 20; i++) {
    const offer = await prisma.offer.create({
      data: {
        agencyId: agencies[Math.floor(Math.random() * agencies.length)].id,
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
      },
    });
    offers.push(offer);
  }

  // Create Appointments
  const appointments = [];
  for (let i = 0; i < 30; i++) {
    const studentId = students[Math.floor(Math.random() * students.length)].id;
    const agencyId = agencies[Math.floor(Math.random() * agencies.length)].id;

    // Check if the combination of studentId and agencyId already exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: {
        studentId_agencyId: {
          studentId: studentId,
          agencyId: agencyId,
        },
      },
    });

    if (!existingAppointment) {
      const appointment = await prisma.appointment.create({
        data: {
          studentId: studentId,
          agencyId: agencyId,
          scheduledTime: faker.date.future(),
          status: 'PENDING',
        },
      });
      appointments.push(appointment);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });