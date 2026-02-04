
'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react"
import { updateBookOrderStatus } from '@/app/books/actions'
import { useRouter } from 'next/navigation'

export function OrderStatusActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleUpdate = async (status: string) => {
        if (status === currentStatus) return

        startTransition(async () => {
            const result = await updateBookOrderStatus(orderId, status)
            if (result?.error) {
                alert(result.error)
            } else {
                router.refresh()
            }
        })
    }

    if (isPending) return <Loader2 className="h-4 w-4 animate-spin text-primary" />

    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                variant={currentStatus === 'pending' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 hover:text-amber-600"
                onClick={() => handleUpdate('pending')}
                title="Chờ xử lý"
            >
                <Clock className="h-4 w-4" />
            </Button>
            <Button
                variant={currentStatus === 'completed' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 hover:text-green-600"
                onClick={() => handleUpdate('completed')}
                title="Hoàn thành"
            >
                <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
                variant={currentStatus === 'cancelled' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 hover:text-destructive"
                onClick={() => handleUpdate('cancelled')}
                title="Hủy đơn"
            >
                <XCircle className="h-4 w-4" />
            </Button>
        </div>
    )
}

