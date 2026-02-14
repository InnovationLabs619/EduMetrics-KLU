import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
    },
})

export async function sendAssessmentEmail(to: string, pdfBuffer: Buffer, studentName: string) {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"EduMetrics Admin" <admin@edumetrics.klu.edu>',
            to,
            subject: `SWEAR Assessment Receipt - ${studentName}`,
            text: `Dear Admin/Student,\n\nPlease find attached the SWEAR Assessment report for ${studentName}.\n\nBest,\nEduMetrics Team`,
            attachments: [
                {
                    filename: `SWEAR_Report_${studentName.replace(/\s+/g, '_')}.pdf`,
                    content: pdfBuffer,
                },
            ],
        })
        console.log("Message sent: %s", info.messageId)
        return true
    } catch (error) {
        console.error("Error sending email:", error)
        return false
    }
}
