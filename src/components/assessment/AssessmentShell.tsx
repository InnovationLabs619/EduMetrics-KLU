'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StrengthsPanel } from './panels/StrengthsPanel'
import { EligibilityPanel } from './panels/EligibilityPanel'
import { ResourcesPanel } from './panels/ResourcesPanel'
import { SwearSchema, SwearData, AssessmentStep } from '@/types/assessment'
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'
import { SignaturePad } from './SignaturePad'
// import { useRouter } from 'next/navigation' -> removed
import { toast } from 'sonner'

const steps: AssessmentStep[] = ['sw', 'ea', 'r', 'review', 'signature']

export function AssessmentShell() {
    const [currentStep, setCurrentStep] = useState<AssessmentStep>('sw')
    const [signatureData, setSignatureData] = useState<string | null>(null)
    const [submittedId, setSubmittedId] = useState<string | null>(null)
    // const router = useRouter() -> removed

    const form = useForm<SwearData>({
        resolver: zodResolver(SwearSchema),
        mode: "onChange",
        defaultValues: {
            strengths: "",
            weaknesses: "",
            eligibility: "",
            availability: "",
            resources: "",
        },
    })

    const { trigger, handleSubmit } = form

    const handleNext = async () => {
        let isValid = false

        // Validate current step fields before moving forward
        if (currentStep === 'sw') {
            isValid = await trigger(['strengths', 'weaknesses'])
            if (isValid) setCurrentStep('ea')
        } else if (currentStep === 'ea') {
            isValid = await trigger(['eligibility', 'availability'])
            if (isValid) setCurrentStep('r')
        } else if (currentStep === 'r') {
            isValid = await trigger(['resources'])
            if (isValid) setCurrentStep('review')
        } else if (currentStep === 'review') {
            setCurrentStep('signature')
        }
    }

    const handleBack = () => {
        if (currentStep === 'ea') setCurrentStep('sw')
        else if (currentStep === 'r') setCurrentStep('ea')
        else if (currentStep === 'review') setCurrentStep('r')
        else if (currentStep === 'signature') setCurrentStep('review')
    }

    const onSignatureSave = async (data: string) => {
        setSignatureData(data)
        await handleSubmit((formData) => onSubmit(formData, data))()
    }

    const onSubmit = async (data: SwearData, sig: string) => {
        try {
            const payload = {
                ...data,
                signatureBlob: sig
            }

            const res = await fetch('/api/assessment/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Submission failed")
            }

            const responseData = await res.json()
            setSubmittedId(responseData.id)
            toast.success("Assessment submitted successfully.")

        } catch (error: any) {
            toast.error(error.message || "Failed to submit assessment.")
        }
    }

    if (submittedId) {
        return (
            <div className="max-w-md mx-auto py-10 px-4 text-center">
                <Card className="shadow-lg border-t-4 border-t-green-600">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Submission Successful!</CardTitle>
                        <CardDescription>
                            Your SWEAR analysis has been recorded. You can now download your digital receipt.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button className="w-full" onClick={() => window.open(`/api/assessment/${submittedId}/pdf`, '_blank')}>
                            Download Receipt (PDF)
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                            Start New Assessment
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <Card className="shadow-lg border-t-4 border-t-blue-600">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center justify-between">
                        <span>SWEAR Assessment</span>
                        <span className="text-sm font-normal text-gray-500 capitalize">
                            Step {steps.indexOf(currentStep) + 1} of {steps.length}
                        </span>
                    </CardTitle>
                    <CardDescription>
                        Complete all sections to generate your comprehensive academic profile.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form className="space-y-8">
                            {currentStep === 'sw' && <StrengthsPanel form={form} />}
                            {currentStep === 'ea' && <EligibilityPanel form={form} />}
                            {currentStep === 'r' && <ResourcesPanel form={form} />}

                            {currentStep === 'review' && (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
                                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                                        <h3 className="text-xl font-medium">Ready for Review</h3>
                                        <p className="text-gray-500 max-w-md">
                                            You have completed all sections. Please review {`your`} answers if needed, then proceed to sign.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {currentStep === 'signature' && (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                                    <h3 className="text-lg font-medium text-center">Digital Signature</h3>
                                    <p className="text-sm text-gray-500 text-center">Please sign below to verify your submission.</p>
                                    <SignaturePad onSave={onSignatureSave} />
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex justify-between border-t p-6 bg-gray-50/50">
                    {currentStep !== 'signature' && (
                        <>
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 'sw'}
                                type="button"
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Back
                            </Button>

                            <Button onClick={handleNext} type="button">
                                {currentStep === 'review' ? 'Proceed to Sign' : 'Next'} <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </>
                    )}
                    {currentStep === 'signature' && (
                        <Button variant="outline" onClick={handleBack} type="button">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
