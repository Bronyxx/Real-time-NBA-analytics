const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require("@prisma/adapter-pg");
const  config  = require('./index.js');
const connectionString = config.DATABASE_URL;

const globalForPrisma = global;
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
if (!globalForPrisma.prisma) {
   

     globalForPrisma.prisma = new PrismaClient({
          adapter,
          log: ['error', 'warn'],
     });
}

const prisma = globalForPrisma.prisma;

module.exports = prisma;