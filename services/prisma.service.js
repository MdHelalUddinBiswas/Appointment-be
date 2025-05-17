const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create global prisma instance to prevent too many connections in development
const globalForPrisma = global;

// Check if we already have a Prisma instance to avoid multiple connections
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

console.log('Prisma client initialized');

// Add middleware for logging query performance
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});

// Export the Prisma client instance
module.exports = prisma;
