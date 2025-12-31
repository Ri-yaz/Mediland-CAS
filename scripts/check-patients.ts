
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.patient.count();
        console.log(`Remaining patients: ${count}`);

        // Also list emails if any
        if (count > 0) {
            const patients = await prisma.patient.findMany({ select: { email: true } });
            console.log('Emails:', patients.map(p => p.email));
        }

    } catch (error) {
        console.error('Error counting patients:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
