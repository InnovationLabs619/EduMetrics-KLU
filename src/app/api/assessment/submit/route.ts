import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateAssessmentPDF } from '@/lib/pdf'
import { sendAssessmentEmail } from '@/lib/email'

// Define schema for validation
const submissionSchema = z.object({
    strengths: z.string(),
    weaknesses: z.string(),
    eligibility: z.string(),
    availability: z.string(),
    resources: z.string(),
    signatureBlob: z.string(),
})

export async function POST(request: Request) {
    try {
        const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]

        // Fallback if cookie parsing fails in header, try standard way if needed, 
        // but middleware should ensure token validity.
        // Actually, simple way to get cookie in route handlers:
        const cookieStore = request.headers.get('cookie')
        const tokenValue = cookieStore?.match(/token=([^;]+)/)?.[1]

        if (!tokenValue) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const payload = await verifyToken(tokenValue) as any
        if (!payload || !payload.id) {
            return NextResponse.json({ error: "Invalid Token" }, { status: 401 })
        }

        const body = await request.json()
        const validation = submissionSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: "Validation Failed" }, { status: 400 })
        }

        const { strengths, weaknesses, eligibility, availability, resources, signatureBlob } = validation.data

        // Save to Database
        const assessment = await prisma.assessment.create({
            data: {
                studentId: payload.id,
                swearDataJson: {
                    strengths,
                    weaknesses,
                    eligibility,
                    availability,
                    resources
                },
                signatureBlob,
                status: "SUBMITTED"
            }
        })

        // TODO: Trigger Google Sheets Sync
        // TODO: Generate PDF & Email

        return NextResponse.json({ success: true, id: assessment.id })

    } catch (error) {
        console.error("Submission Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
