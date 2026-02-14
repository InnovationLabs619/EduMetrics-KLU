import { UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { SwearData } from "@/types/assessment"

interface PanelProps {
    form: UseFormReturn<SwearData>
}

export function EligibilityPanel({ form }: PanelProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Eligibility & Availability</h2>
                <p className="text-sm text-gray-500">
                    Detail your eligibility for opportunities and your time availability.
                </p>
            </div>

            <FormField
                control={form.control}
                name="eligibility"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Eligibility Criteria</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Describe your eligibility (GPA, certifications, prerequisites...)"
                                className="min-h-[120px] resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="When are you available for projects/internships?"
                                className="min-h-[120px] resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
