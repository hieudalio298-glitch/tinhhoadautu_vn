
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
import { Edit, Trash, Download, ShoppingCart } from "lucide-react"

export default async function AdminBooksPage() {
    const supabase = await createClient()
    const { data: books } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý sách</h1>
                <Button asChild>
                    <Link href="/admin/books/new">Thêm sách mới</Link>
                </Button>
            </div>

            <div className="bg-card rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên sách</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead>Giá</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books?.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell className="font-medium">{book.title}</TableCell>
                                <TableCell>{book.author || 'N/A'}</TableCell>
                                <TableCell>
                                    {book.price > 0 ? (
                                        <span className="font-semibold text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}</span>
                                    ) : (
                                        <span className="text-green-600 font-bold">Miễn phí</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {book.is_free ? (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <Download className="h-4 w-4" /> PDF Free
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <ShoppingCart className="h-4 w-4" /> Bán lẻ
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/books/${book.id}`}>
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!books || books.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Chưa có quyển sách nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
