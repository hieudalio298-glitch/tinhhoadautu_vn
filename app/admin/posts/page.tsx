
import { createClient } from '@/utils/supabase/server'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, Trash, Eye } from "lucide-react"

export default async function AdminPostsPage() {
    const supabase = await createClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('id, title, created_at, published, view_count')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
                <Button asChild>
                    <Link href="/admin/posts/new">Viết bài mới</Link>
                </Button>
            </div>

            <div className="bg-card rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Lượt xem</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts?.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">{post.title}</TableCell>
                                <TableCell>{new Date(post.created_at).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        {post.view_count || 0}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {post.published ? (
                                        <span className="text-green-600 font-medium">Đã xuất bản</span>
                                    ) : (
                                        <span className="text-yellow-600 font-medium">Nháp</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/posts/${post.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {posts?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Chưa có bài viết nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
