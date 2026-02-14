import { AssessmentShell } from '@/components/assessment/AssessmentShell'

export default function AssessmentPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto">
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Student Assessment Portal</h1>
                    <p className="text-muted-foreground">Complete your SWEAR analysis to unlock resources.</p>
                </div>
                <AssessmentShell />
            </div>
        </div>
    )
}
