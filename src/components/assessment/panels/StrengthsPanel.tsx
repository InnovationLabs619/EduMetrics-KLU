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

export function StrengthsPanel({ form }: PanelProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Strengths & Weaknesses</h2>
                <p className="text-sm text-gray-500">
                    Reflect on your personal and academic attributes. Be honest and detailed.
                </p>
            </div>

            <FormField
                control={form.control}
                name="strengths"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>My Strengths</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="List your key strengths (e.g., problem-solving, leadership...)"
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
                name="weaknesses"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>My Weaknesses</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Identify areas for improvement..."
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
