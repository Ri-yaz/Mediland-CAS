import nodemailer from "nodemailer";

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};

export const generateAppointmentEmail = (
    patientName: string,
    doctorName: string,
    status: string,
    date: Date,
    time: string,
    reason?: string
) => {
    const isApproved = status === "SCHEDULED";
    const headerColor = isApproved ? "#10b981" : "#ef4444"; // Green or Red
    const statusText = isApproved ? "Approved" : "Declined";

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="background-color: ${headerColor}; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Appointment ${statusText}</h1>
        </div>
        <div style="padding: 20px;">
            <p>Dear <strong>${patientName}</strong>,</p>
            <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been <strong>${statusText.toLowerCase()}</strong>.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${date.toDateString()}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
                ${!isApproved && reason
            ? `<p style="margin: 5px 0;"><strong>Reason:</strong> ${reason}</p>`
            : ""
        }
            </div>

            <p>If you have any questions, please contact our support.</p>
            <p>Best regards,<br/>Mediland Team</p>
        </div>
    </div>
  `;
};

export const generateBookingConfirmationEmail = (
    patientName: string,
    doctorName: string,
    date: Date,
    time: string
) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="background-color: #3b82f6; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Appointment Under Review</h1>
        </div>
        <div style="padding: 20px;">
            <p>Dear <strong>${patientName}</strong>,</p>
            <p>Thank you for booking an appointment with <strong>Dr. ${doctorName}</strong>. Your request is currently <strong>under review</strong>.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${date.toDateString()}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> PENDING / UNDER REVIEW</p>
            </div>

            <p>You will receive another email once the doctor approves or declines your request.</p>
            <p>Best regards,<br/>Mediland Team</p>
        </div>
    </div>
  `;
};
