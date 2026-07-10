const { PrismaClient } = require('@prisma/client');

// Singleton PrismaClient agar tidak membuka banyak koneksi database
const prisma = new PrismaClient();

module.exports = prisma;
