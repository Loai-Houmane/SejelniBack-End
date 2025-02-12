const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminAuth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });

    if (!admin) {
      return res.status(401).send('Access denied. Admin not found.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

module.exports = adminAuth;