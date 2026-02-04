
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Users, TrendingUp } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch stats concurrently
    const [
        { count: postCount },
        { count: commentCount },
        { count: userCount }, // Note: We might not have access to auth.users count directly easily via client, using profiles instead
        { count: subscriberCount }
    ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('subscribers').select('*', { count: 'exact', head: true })
    ])

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Tổng quan</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng bài viết</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{postCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bình luận</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{commentCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subscriberCount || 0}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
