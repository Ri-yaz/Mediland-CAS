import { z } from "zod";

export const PatientFormSchema = z.object({
    title: z.string().optional(),
    first_name: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(30, "First name can't be more than 30 characters"),
    last_name: z
        .string()
        .trim()
        .min(2, "Last name must be at least 2 characters")
        .max(30, "Last name can't be more than 30 characters"),
    date_of_birth: z.coerce.date(),
    gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
    phone: z.string().min(10, "Enter phone number").max(15, "Enter phone number"),
    email: z.string().email("Invalid email address."),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(500, "Address must be at most 500 characters"),
    marital_status: z.enum(
        ["married", "single", "divorced", "widowed", "separated"],
        { message: "Marital status is required." }
    ),
    emergency_contact_name: z
        .string()
        .min(2, "Emergency contact name is required.")
        .max(50, "Emergency contact must be at most 50 characters"),
    emergency_contact_number: z
        .string()
        .min(10, "Enter phone number")
        .max(15, "Enter phone number"),
    relation: z.enum(["mother", "father", "husband", "wife", "other"], {
        message: "Relations with contact person required",
    }),
    blood_group: z.string().optional(),
    allergies: z.string().optional(),
    medical_conditions: z.string().optional(),
    medical_history: z.string().optional(),
    insurance_provider: z.string().optional(),
    insurance_number: z.string().optional(),
    privacy_consent: z
        .boolean()
        .default(false)
        .refine((val) => val === true, {
            message: "You must agree to the privacy policy.",
        }),
    service_consent: z
        .boolean()
        .default(false)
        .refine((val) => val === true, {
            message: "You must agree to the terms of service.",
        }),
    medical_consent: z
        .boolean()
        .default(false)
        .refine((val) => val === true, {
            message: "You must agree to the medical treatment terms.",
        }),
    img: z.string().optional(),
});

export const AppointmentSchema = z.object({
    doctorId: z.string().min(1, "Select physician"),
    type: z.string().min(1, "Select type of appointment"),
    appointmentDate: z.string().min(1, "Select appointment date"),
    time: z.string().min(1, "Select appointment time"),
    note: z.string().optional(),
});

export const DoctorSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    phone: z.string().min(10, "Enter phone number").max(15, "Enter phone number"),
    email: z.string().email("Invalid email address."),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(500, "Address must be at most 500 characters"),
    specialization: z.string().min(2, "Specialization is required."),
    licenseNumber: z.string().min(2, "License number is required"),
    jobType: z.enum(["FULL", "PART"], { message: "Type is required." }),
    department: z.string().min(2, "Department is required."),
    img: z.string().optional(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" })
        .optional()
        .or(z.literal("")),
});

export const workingDaySchema = z.object({
    day: z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]),
    startTime: z.string(),
    endTime: z.string(),
});

export const WorkingDaysSchema = z.array(workingDaySchema).optional();

export const StaffSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    role: z.enum(["NURSE", "LAB_TECHNICIAN"], { message: "Role is required." }),
    phone: z
        .string()
        .min(10, "Contact must be 10-digits")
        .max(15, "Contact must be 10-15 digits"),
    email: z.string().email("Invalid email address."),
    address: z
        .string()
        .min(5, "Address must be at least 5 characters")
        .max(500, "Address must be at most 500 characters"),
    licenseNumber: z.string().optional(),
    department: z.string().optional(),
    img: z.string().optional(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long!" })
        .optional()
        .or(z.literal("")),
});

export const VitalSignsSchema = z.object({
    patientId: z.string(),
    medicalRecordId: z.string(),
    bodyTemperature: z.coerce.number({
        message: "Enter recorded body temperature",
    }),
    heartRate: z.coerce.number({ message: "Enter recorded heartbeat rate" }),
    systolicBP: z.coerce.number({
        message: "Enter recorded systolic blood pressure",
    }),
    diastolicBP: z.coerce.number({
        message: "Enter recorded diastolic blood pressure",
    }),
    respiratoryRate: z.coerce.number().optional(),
    oxygenSaturation: z.coerce.number().optional(),
    weight: z.coerce.number({ message: "Enter recorded weight (Kg)" }),
    height: z.coerce.number({ message: "Enter recorded height (Cm)" }),
});

export const DiagnosisSchema = z.object({
    patientId: z.string(),
    medicalRecordId: z.string(),
    doctorId: z.string(),
    symptoms: z.string({ message: "Symptoms required" }),
    diagnosisDescription: z.string({ message: "Diagnosis required" }),
    diagnosisCode: z.string().optional(),
    notes: z.string().optional(),
    prescribedMedications: z.string().optional(),
    followUpPlan: z.string().optional(),
    severity: z.string().optional(),
});

export const PaymentSchema = z.object({
    id: z.string(),
    billDate: z.coerce.date(),
    discount: z.string({ message: "discount" }),
    totalAmount: z.string(),
});

export const BillItemSchema = z.object({
    paymentId: z.string(),
    serviceId: z.string(),
    serviceDate: z.string(),
    appointmentId: z.string(),
    quantity: z.string({ message: "Quantity is required" }),
    unitCost: z.string({ message: "Unit cost is required" }),
    totalCost: z.string({ message: "Total cost is required" }),
});

export const ServiceSchema = z.object({
    serviceName: z.string({ message: "Service name is required" }),
    price: z.string({ message: "Service price is required" }),
    description: z.string({ message: "Service description is required" }),
    category: z.string({ message: "Service category is required" }),
});
