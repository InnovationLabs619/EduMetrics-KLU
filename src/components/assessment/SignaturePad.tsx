'use client'

import React, { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from "@/components/ui/button"
import { Eraser, Save } from 'lucide-react'

interface SignaturePadProps {
    onSave: (signatureData: string) => void
}

export function SignaturePad({ onSave }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null)
    const [isEmpty, setIsEmpty] = useState(true)

    const clear = () => {
        sigCanvas.current?.clear()
        setIsEmpty(true)
    }

    const save = () => {
        if (sigCanvas.current) {
            if (sigCanvas.current.isEmpty()) {
                setIsEmpty(true)
                return
            }
            // Get base64 string
            const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
            onSave(dataURL)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-1 bg-white w-full max-w-md">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        className: "w-full h-40 rounded-md cursor-crosshair bg-gray-50",
                        style: { width: '100%', height: '160px' }
                    }}
                    onBegin={() => setIsEmpty(false)}
                />
            </div>

            <div className="text-xs text-gray-500">
                Sign above using your mouse or touch screen.
            </div>

            <div className="flex space-x-4">
                <Button variant="outline" onClick={clear} type="button">
                    <Eraser className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button onClick={save} type="button" disabled={isEmpty}>
                    <Save className="mr-2 h-4 w-4" /> Confirm Signature
                </Button>
            </div>
        </div>
    )
}
