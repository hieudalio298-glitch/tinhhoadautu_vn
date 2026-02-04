'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Clock } from "lucide-react"
import { processUpgradeRequest } from './actions'

interface UpgradeRequest {
    id: string
    user_id: string
    email: string
    plan_type: string
    status: string
    created_at: string
}

export default function AdminUpgradesPage() {
    const [requests, setRequests] = useState<UpgradeRequest[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchRequests = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('upgrade_requests')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setRequests(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleAction = async (request: UpgradeRequest, action: 'approve' | 'reject') => {
        const confirmMsg = action === 'approve'
            ? `Phê duyệt nâng cấp cho ${request.email} lên gói ${request.plan_type}?`
            : `Từ chối yêu cầu của ${request.email}?`

        if (!confirm(confirmMsg)) return

        const result = await processUpgradeRequest(request.id, request.user_id, request.plan_type, action)

        if (result.success) {
            fetchRequests()
        } else {
            alert('Lỗi: ' + result.error)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Danh sách yêu cầu nâng cấp</h1>
            <p className="text-muted-foreground">Phê duyệt hoặc từ chối các yêu cầu nâng cấp tài khoản từ người dùng.</p>

            <div className="bg-card rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Gói đăng ký</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày gửi</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">Đang tải dữ liệu...</TableCell>
                            </TableRow>
                        ) : requests.length > 0 ? (
                            requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="uppercase font-bold text-primary">
                                            {request.plan_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            {request.status === 'pending' && <Clock className="h-3.5 w-3.5 text-yellow-500" />}
                                            {request.status === 'approved' && <Check className="h-3.5 w-3.5 text-green-500" />}
                                            {request.status === 'rejected' && <X className="h-3.5 w-3.5 text-red-500" />}
                                            <span className={
                                                request.status === 'pending' ? 'text-yellow-600' :
                                                    request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                                            }>
                                                {request.status === 'pending' ? 'Chờ xử lý' :
                                                    request.status === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(request.created_at).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        {request.status === 'pending' && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleAction(request, 'approve')}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Duyệt
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleAction(request, 'reject')}
                                                >
                                                    <X className="h-4 w-4 mr-1" /> Từ chối
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Không có yêu cầu nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
