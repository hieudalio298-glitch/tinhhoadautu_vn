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
import { RoleUpdater } from "./role-updater"

interface UserInfo {
    id: string
    email: string | null
    username: string | null
    role: string | null
    created_at: string
}

export default async function AdminUsersPage() {
    const supabase = await createClient()

    // Try to get users with RPC function
    const { data: users, error } = await supabase.rpc('get_user_info')

    console.log('Users data:', users, 'Error:', error)

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

            {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded mb-4">
                    Lỗi: {error.message}
                </div>
            )}

            <div className="bg-card rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Tên người dùng</TableHead>
                            <TableHead>Vai trò hiện tại</TableHead>
                            <TableHead>Thay đổi quyền</TableHead>
                            <TableHead>Ngày tham gia</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users && users.length > 0 ? (
                            users.map((user: UserInfo) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.email || 'N/A'}</TableCell>
                                    <TableCell>{user.username || 'Chưa đặt tên'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === 'admin' ? 'default' :
                                                    user.role === 'pro' ? 'destructive' : 'secondary'
                                            }
                                        >
                                            {user.role === 'pro' ? 'Hội viên VIP' : user.role || 'user'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <RoleUpdater userId={user.id} currentRole={user.role || 'user'} />
                                    </TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString('vi-VN')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {error ? 'Không thể tải danh sách người dùng.' : 'Chưa có người dùng nào.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
