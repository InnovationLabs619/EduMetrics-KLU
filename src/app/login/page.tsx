'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
    rollNumber: z.string().min(1, { message: "Roll Number is required." }),
    nameCluster: z.string().min(1, { message: "Name Cluster is required." }),
    groupName: z.string().min(1, { message: "Group Name is required." }),
})

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rollNumber: "",
            nameCluster: "",
            groupName: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            if (res.ok) {
                router.push('/assessment')
            } else {
                const data = await res.json()
                setError(data.error || "Login failed")
            }
        } catch (error) {
            setError("An unexpected error occurred.")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">EduMetrics-KLU Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to access the assessment portal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="rollNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Roll Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your roll number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nameCluster"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name Cluster</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Computer Science A" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="groupName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Group 5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}

                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
