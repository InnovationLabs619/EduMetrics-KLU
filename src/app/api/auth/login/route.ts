import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
    rollNumber: z.string().min(1, "Roll Number is required"),
    nameCluster: z.string().min(1, "Name Cluster is required"),
    groupName: z.string().min(1, "Group Name is required"),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = loginSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
        }

        const { rollNumber, nameCluster, groupName } = result.data

        // Find or create student
        // In a real strict environment, you might only find. Here we allow creation for ease of use.
        const student = await prisma.student.upsert({
            where: { rollNumber },
            update: {
                nameCluster,
                groupName,
            },
            create: {
                rollNumber,
                nameCluster,
                groupName,
            },
        })

        const token = await signToken({
            id: student.id,
            rollNumber: student.rollNumber,
            nameCluster: student.nameCluster,
            groupName: student.groupName,
        })

        const response = NextResponse.json({ success: true })

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 2, // 2 hours
            path: '/',
        })

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
