
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Clearing patient data...');
        // Delete all patients to resolve duplicate key issues during unique index creation
        await prisma.patient.deleteMany({});
        console.log('Patient data cleared successfully.');
    } catch (error) {
        console.error('Error clearing patient data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
