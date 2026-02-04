import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Eye, TrendingUp, Lock } from 'lucide-react'

export async function TopPosts() {
    const supabase = await createClient()

    // Fetch top 5 posts with most views
    const { data: posts } = await supabase
        .from('posts')
        .select(`
            id,
            title,
            slug,
            view_count,
            cover_image,
            categories (
                slug
            )
        `)
        .eq('published', true)
        .order('view_count', { ascending: false })
        .limit(5)

    if (!posts || posts.length === 0) {
        return null
    }

    return (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-primary">Top bài viết</h3>
            </div>
            <div className="space-y-3">
                {posts.map((post, index) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex items-start gap-3 hover:bg-background/50 rounded-lg p-2 -m-2 transition-colors"
                    >
                        {/* Ranking number */}
                        <div className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                            ${index === 0 ? 'bg-yellow-500 text-yellow-900' :
                                index === 1 ? 'bg-gray-300 text-gray-700' :
                                    index === 2 ? 'bg-orange-400 text-orange-900' :
                                        'bg-muted text-muted-foreground'}
                        `}>
                            {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors flex items-center gap-1">
                                {Array.isArray(post.categories) && post.categories[0]?.slug === 'khuyen-nghi' && (
                                    <Lock className="h-3 w-3 text-destructive shrink-0" />
                                )}
                                {post.title}
                            </h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>{post.view_count?.toLocaleString('vi-VN') || 0} lượt xem</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
