import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { generateRandomColor } from "../utils";

const prisma = new PrismaClient();

async function seed() {
    console.log("Seeding data...");

    // Clear existing data to avoid duplicates/conflicts (Optional, but recommended for clean seed)
    // await prisma.appointment.deleteMany();
    // await prisma.workingDays.deleteMany();
    // await prisma.patient.deleteMany();
    // await prisma.doctor.deleteMany();
    // await prisma.staff.deleteMany();

    // Create 3 staff members
    const staffRoles = ["NURSE", "CASHIER", "LAB_TECHNICIAN"] as const;
    for (const role of staffRoles) {
        await prisma.staff.create({
            data: {
                id: `user_${faker.string.alphanumeric(20)}`,
                email: faker.internet.email(),
                name: faker.person.fullName(),
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                department: faker.company.name(),
                role: role,
                status: "ACTIVE",
                colorCode: generateRandomColor(),
            },
        });
    }

    // Create 10 doctors
    const doctors = [];
    for (let i = 0; i < 10; i++) {
        const doctor = await prisma.doctor.create({
            data: {
                id: `user_${faker.string.alphanumeric(20)}`,
                email: faker.internet.email(),
                name: faker.person.fullName(),
                specialization: faker.person.jobTitle(),
                license_number: faker.string.alphanumeric(10).toUpperCase(),
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                department: faker.company.name(),
                availability_status: "ACTIVE",
                colorCode: generateRandomColor(),
                type: i % 2 === 0 ? "FULL" : "PART",
                working_days: {
                    create: [
                        {
                            day: "Monday",
                            start_time: "08:00",
                            close_time: "17:00",
                        },
                        {
                            day: "Wednesday",
                            start_time: "08:00",
                            close_time: "17:00",
                        },
                    ],
                },
            },
        });
        doctors.push(doctor);
    }

    // Create 20 patients
    const patients = [];
    for (let i = 0; i < 20; i++) {
        const patient = await prisma.patient.create({
            data: {
                id: `user_${faker.string.alphanumeric(20)}`,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                date_of_birth: faker.date.birthdate(),
                gender: i % 2 === 0 ? "MALE" : "FEMALE",
                phone: faker.phone.number(),
                email: faker.internet.email(),
                marital_status: i % 3 === 0 ? "Married" : "Single",
                address: faker.location.streetAddress(),
                emergency_contact_name: faker.person.fullName(),
                emergency_contact_number: faker.phone.number(),
                relation: "Sibling",
                blood_group: i % 4 === 0 ? "O+" : "A+",
                allergies: faker.lorem.words(2),
                medical_conditions: faker.lorem.words(3),
                privacy_consent: true,
                service_consent: true,
                medical_consent: true,
                colorCode: generateRandomColor(),
            },
        });

        patients.push(patient);
    }

    // Create Appointments
    for (let i = 0; i < 20; i++) {
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];
        const patient = patients[Math.floor(Math.random() * patients.length)];

        await prisma.appointment.create({
            data: {
                patient_id: patient.id,
                doctor_id: doctor.id,
                appointment_date: faker.date.soon(),
                time: "10:00",
                status: i % 4 === 0 ? "PENDING" : "SCHEDULED",
                type: "Checkup",
                reason: faker.lorem.sentence(),
            },
        });
    }

    console.log("Seeding complete!");
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
