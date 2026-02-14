import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAssessmentPDF } from '@/lib/pdf'
import { SwearData } from '@/types/assessment'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id

        const assessment = await prisma.assessment.findUnique({
            where: { id },
            include: { student: true }
        })

        if (!assessment) {
            return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
        }

        // In a real app, verify the user requesting owns this assessment or is admin.
        // Skipping strict auth check here for simplicity of demo, but middleware protects the route path generally.

        const studentInfo = {
            rollNumber: assessment.student.rollNumber,
            nameCluster: assessment.student.nameCluster,
            groupName: assessment.student.groupName
        }

        const swearData = assessment.swearDataJson as unknown as SwearData

        const pdfArrayBuffer = await generateAssessmentPDF(studentInfo, swearData, assessment.signatureBlob)
        const pdfBuffer = Buffer.from(pdfArrayBuffer)

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="SWEAR_Report_${studentInfo.rollNumber}.pdf"`
            }
        })

    } catch (error) {
        console.error("PDF Generation Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
