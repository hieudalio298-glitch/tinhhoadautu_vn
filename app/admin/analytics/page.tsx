import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Users, FileText, TrendingUp } from 'lucide-react'
import TrafficChart from './traffic-chart'

export default async function AnalyticsPage() {
    const supabase = await createClient()

    // Total pageviews
    const { count: totalViews } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })

    // Views in last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: recentViews } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())

    // User count
    const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // Post count
    const { count: postCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })

    // Get daily views for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: dailyViews } = await supabase
        .from('analytics')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Phân tích lưu lượng</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews || 0}</div>
                        <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">7 ngày qua</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentViews || 0}</div>
                        <p className="text-xs text-muted-foreground">Lượt xem gần đây</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Tổng số thành viên</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bài viết</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{postCount || 0}</div>
                        <p className="text-xs text-muted-foreground">Tổng số bài đăng</p>
                    </CardContent>
                </Card>
            </div>

            <TrafficChart data={dailyViews || []} />
        </div>
    )
}
