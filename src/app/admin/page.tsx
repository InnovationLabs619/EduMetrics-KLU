import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Force dynamic rendering since we are fetching data
export const dynamic = 'force-dynamic'

async function getSubmissions() {
    const submissions = await prisma.assessment.findMany({
        include: {
            student: true
        },
        orderBy: {
            submittedAt: 'desc'
        }
    })
    return submissions
}

export default async function AdminDashboard() {
    const submissions = await getSubmissions()

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>View and manage student SWEAR assessments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Roll Number</TableHead>
                                <TableHead>Cluster</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No submissions yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((sub: any) => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-medium">{sub.student.rollNumber}</TableCell>
                                        <TableCell>{sub.student.nameCluster}</TableCell>
                                        <TableCell>{sub.student.groupName}</TableCell>
                                        <TableCell>{sub.status}</TableCell>
                                        <TableCell>{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            {/* Placeholder for View/PDF Action */}
                                            <span className="text-blue-600 cursor-pointer hover:underline">View PDF</span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
