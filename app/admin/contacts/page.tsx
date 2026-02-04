
import { createClient } from '@/utils/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, User } from "lucide-react"

export default async function AdminContactsPage() {
    const supabase = await createClient()

    const { data: submissions } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Danh sách phản hồi</h1>
                <Badge variant="outline" className="px-3 py-1">
                    Tổng số: {submissions?.length || 0}
                </Badge>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[200px]">Người gửi</TableHead>
                            <TableHead className="w-[150px]">Thông tin liên hệ</TableHead>
                            <TableHead>Nội dung</TableHead>
                            <TableHead className="text-right">Ngày gửi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions?.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/20 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="font-bold text-slate-900 flex items-center gap-1">
                                            <User className="h-3 w-3 text-primary" />
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground italic mt-0.5">
                                            {item.subject || 'Không có tiêu đề'}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors">
                                            <Mail className="h-3 w-3" />
                                            {item.email}
                                        </div>
                                        {item.phone && (
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                {item.phone}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[400px]">
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {item.message}
                                    </p>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground opacity-60">
                                            {new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {item.status === 'unread' && (
                                            <Badge className="bg-blue-500 text-[10px] h-4">Mới</Badge>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!submissions || submissions.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                                    Chưa có phản hồi nào từ người dùng.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
