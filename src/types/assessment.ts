import { z } from "zod"

export const SwearSchema = z.object({
    // Panel 1: S-W
    strengths: z.string().min(10, "Please provide at least 10 characters describing your strengths."),
    weaknesses: z.string().min(10, "Please provide at least 10 characters describing your weaknesses."),

    // Panel 2: E-A
    eligibility: z.string().min(10, "Please describe your eligibility criteria/status."),
    availability: z.string().min(10, "Please describe your availability."),

    // Panel 3: R
    resources: z.string().min(10, "Please list the resources available to you."),
})

export type SwearData = z.infer<typeof SwearSchema>

export type AssessmentStep = 'sw' | 'ea' | 'r' | 'review' | 'signature'
