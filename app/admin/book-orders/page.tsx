
export const dynamic = 'force-dynamic'

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
import { ShoppingCart, Calendar, User, Book as BookIcon, CheckCircle2, Clock, XCircle, MoreHorizontal, Phone, Mail, MapPin } from "lucide-react"
import { OrderStatusActions } from "./order-actions"

export default async function AdminBookOrdersPage() {
    const supabase = await createClient()

    // Fetch ONLY pending orders for the table
    const { data: orders, error } = await supabase
        .from('book_orders')
        .select(`
            *,
            books (title, cover_image),
            profiles (username)
        `)
        .order('created_at', { ascending: false })

    // Calculate total revenue from ALL completed orders
    const { data: revenueData } = await supabase
        .from('book_orders')
        .select('amount')
        .eq('status', 'completed')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.amount), 0) || 0

    if (error) {
        console.error('Error fetching orders:', error)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3 italic">
                        <ShoppingCart className="h-8 w-8 text-primary" />
                        Quản lý <span className="text-primary">Đơn mua sách</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">Theo dõi và xử lý các yêu cầu mua sách giấy từ khách hàng.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col items-end min-w-[200px]">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tổng doanh thu</span>
                        <span className="text-2xl font-black text-green-600 tracking-tighter">
                            {new Intl.NumberFormat('vi-VN').format(totalRevenue)}đ
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1 bg-amber-100 text-amber-700 border-amber-200 font-bold">
                    {orders?.filter(o => o.status === 'pending').length || 0} Đơn chưa xử lý
                </Badge>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl">
                    <p className="font-bold">Lỗi truy vấn dữ liệu:</p>
                    <p className="text-sm">{error.message}</p>
                    <p className="text-xs mt-2 opacity-70">Gợi ý: Kiểm tra cấu hình Quyền (RLS) hoặc Khóa ngoại (Foreign Key) trong Database.</p>
                </div>
            )}

            <div className="bg-card rounded-2xl border shadow-sm overflow-hidden bg-white">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px] py-4">Mã đơn</TableHead>
                            <TableHead>Khách hàng</TableHead>
                            <TableHead>Sách</TableHead>
                            <TableHead>Số tiền</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thời gian</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id} className="group hover:bg-muted/10 transition-colors border-b last:border-0">
                                    <TableCell className="font-mono text-[10px] text-muted-foreground">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col space-y-2">
                                            <div className="font-bold text-slate-900 flex items-center gap-1">
                                                <User className="h-3 w-3 text-primary" />
                                                {order.customer_name || 'Không rõ tên'}
                                            </div>
                                            <div className="flex flex-col text-[11px] space-y-1">
                                                <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors">
                                                    <Phone className="h-3 w-3" />
                                                    {order.customer_phone || 'N/A'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {order.customer_email || 'N/A'}
                                                </div>
                                                <div className="flex items-start gap-1.5 text-muted-foreground max-w-[250px]">
                                                    <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                                    <span className="line-clamp-2 italic">{order.customer_address || 'Chưa cung cấp địa chỉ'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {order.books?.cover_image ? (
                                                <img
                                                    src={order.books.cover_image}
                                                    alt={order.books.title}
                                                    className="w-10 h-14 object-cover rounded shadow-sm group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                                                    <BookIcon className="h-4 w-4 text-muted-foreground opacity-30" />
                                                </div>
                                            )}
                                            <div className="flex flex-col max-w-[200px]">
                                                <span className="font-bold text-sm line-clamp-1">{order.books?.title || 'Sách đã xóa'}</span>
                                                <span className="text-[10px] text-muted-foreground truncate italic">ID: {order.book_id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-slate-900 tracking-tight">
                                            {new Intl.NumberFormat('vi-VN').format(order.amount)}đ
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {order.status === 'pending' && (
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 gap-1 px-2">
                                                <Clock className="h-3 w-3" /> Chờ xử lý
                                            </Badge>
                                        )}
                                        {order.status === 'completed' && (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1 px-2">
                                                <CheckCircle2 className="h-3 w-3" /> Hoàn thành
                                            </Badge>
                                        )}
                                        {order.status === 'cancelled' && (
                                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 gap-1 px-2">
                                                <XCircle className="h-3 w-3" /> Đã hủy
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="text-[10px] opacity-60">
                                                {new Date(order.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <OrderStatusActions orderId={order.id} currentStatus={order.status} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-24">
                                    <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                                        <ShoppingCart className="h-16 w-16" />
                                        <p className="text-lg font-bold">Chưa có đơn hàng nào</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
