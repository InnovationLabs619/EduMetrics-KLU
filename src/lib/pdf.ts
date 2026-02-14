import { jsPDF } from "jspdf"
import { SwearData } from "@/types/assessment"

interface StudentInfo {
    rollNumber: string
    nameCluster: string
    groupName: string
}

export async function generateAssessmentPDF(student: StudentInfo, data: SwearData, signatureBase64: string): Promise<ArrayBuffer> {
    const doc = new jsPDF()

    // -- Header --
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("EduMetrics-KLU: SWEAR Analysis Report", 105, 20, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: "center" })

    // -- Student Details Box --
    doc.setDrawColor(0)
    doc.setFillColor(245, 245, 245)
    doc.rect(14, 40, 182, 30, "F")

    doc.setFont("helvetica", "bold")
    doc.text("Student Profile:", 20, 50)

    doc.setFont("helvetica", "normal")
    doc.text(`Roll Number: ${student.rollNumber}`, 20, 60)
    doc.text(`Name Cluster: ${student.nameCluster}`, 80, 60)
    doc.text(`Group: ${student.groupName}`, 140, 60)

    // -- SWEAR Content --
    let yPos = 85
    const pageHeight = doc.internal.pageSize.height
    const margin = 14
    const contentWidth = 182

    const sections = [
        { title: "Strengths", content: data.strengths },
        { title: "Weaknesses", content: data.weaknesses },
        { title: "Eligibility", content: data.eligibility },
        { title: "Availability", content: data.availability },
        { title: "Resources", content: data.resources },
    ]

    sections.forEach((section) => {
        // Check for page break
        if (yPos > pageHeight - 40) {
            doc.addPage()
            yPos = 20
        }

        doc.setFont("helvetica", "bold")
        doc.setFontSize(14)
        doc.text(section.title, margin, yPos)
        yPos += 8

        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)

        const splitText = doc.splitTextToSize(section.content, contentWidth)
        doc.text(splitText, margin, yPos)

        yPos += (splitText.length * 5) + 10
    })

    // -- Signature --
    // Check space for signature
    if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = 20
    }

    yPos += 10
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, margin + 182, yPos) // Separator
    yPos += 10

    doc.setFont("helvetica", "bold")
    doc.text("Digital Signature Verification:", margin, yPos)
    yPos += 10

    // Add signature image
    if (signatureBase64) {
        try {
            doc.addImage(signatureBase64, "PNG", margin, yPos, 60, 30)
        } catch (e) {
            doc.text("[Signature Image Error]", margin, yPos + 10)
        }
    }

    yPos += 35
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("This document is digitally verified and legally binding within the KLU academic framework.", margin, yPos)

    return doc.output("arraybuffer")
}
