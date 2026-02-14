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

export function ResourcesPanel({ form }: PanelProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Resources</h2>
                <p className="text-sm text-gray-500">
                    What tools, mentors, or materials do you have access to?
                </p>
            </div>

            <FormField
                control={form.control}
                name="resources"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Available Resources</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="List technical resources, mentorship, hardware, etc."
                                className="min-h-[200px] resize-none"
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
