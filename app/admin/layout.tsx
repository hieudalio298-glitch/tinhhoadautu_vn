
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { BarChart, FileText, Plus, Settings, Users, CreditCard, Book, MessageSquare, ShoppingCart } from 'lucide-react'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    console.log('Admin Check:', {
        userId: user.id,
        profileRole: profile?.role,
        error: error?.message,
        profileData: profile
    })

    if (error || profile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <h1 className="text-2xl font-bold text-destructive">Admin Access Denied</h1>
                <div className="bg-muted p-4 rounded text-left font-mono text-sm overflow-auto max-w-lg">
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Role via DB:</strong> {profile?.role || 'null'}</p>
                    <p><strong>Error:</strong> {JSON.stringify(error, null, 2)}</p>
                </div>
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r bg-muted/30">
                <div className="p-6">
                    <h2 className="font-bold text-lg mb-6">StockBlog Admin</h2>
                    <nav className="space-y-2">
                        <Button variant="secondary" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin">
                                <BarChart className="mr-2 h-4 w-4" /> Tổng quan
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/posts">
                                <FileText className="mr-2 h-4 w-4" /> Bài viết
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/posts/new">
                                <Plus className="mr-2 h-4 w-4" /> Viết bài mới
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/users">
                                <Users className="mr-2 h-4 w-4" /> Người dùng
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/upgrades">
                                <CreditCard className="mr-2 h-4 w-4" /> Yêu cầu nâng cấp
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/book-orders">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Đơn mua sách
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/books">
                                <Book className="mr-2 h-4 w-4" /> Quản lý sách
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/contacts">
                                <MessageSquare className="mr-2 h-4 w-4" /> Phản hồi
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/analytics">
                                <BarChart className="mr-2 h-4 w-4" /> Phân tích
                            </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start nav-highlight" asChild>
                            <Link href="/admin/settings">
                                <Settings className="mr-2 h-4 w-4" /> Cài đặt
                            </Link>
                        </Button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
