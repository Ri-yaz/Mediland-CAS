export const siteSettings = {
    name: "Mediland CAS",
    description: "Healthcare Clinic Appointment System",
    logo: "/logo.png",
    address: "123 Healthcare Street, Medical City",
    phone: "+1 234 567 890",
    email: "info@mediland.com",
    workingHours: "Mon - Fri: 8:00 AM - 6:00 PM",
};

export const appointmentDurations = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
];

export const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
}).filter((_, i) => i < 18); // 8:00 AM to 5:00 PM

export const statusColors = {
    PENDING: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
    },
    SCHEDULED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
    },
    COMPLETED: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
    },
    CANCELLED: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
    },
};
