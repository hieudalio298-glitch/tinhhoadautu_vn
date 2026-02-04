
import { createClient } from '@/utils/supabase/server'
import { CommentSection } from '@/components/comment-section'
import { ViewCounter } from '@/components/view-counter'
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Define Props for Next.js 15+ Page Component
// params is a Promise in Next.js 15
type Params = Promise<{ slug: string }>

export default async function PostPage({ params }: { params: Params }) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch post data
    const { data: post } = await supabase
        .from('posts')
        .select(`
      id,
      title,
      content,
      cover_image,
      created_at,
      tags,
      view_count,
      categories (
        name, 
        slug
      ),
      profiles (
        username
      )
    `)
        .eq('slug', slug)
        .single()

    if (!post) {
        notFound()
    }

    // Check for authorization (Khuyến nghị category requires PRO/ADMIN)
    const categorySlug = Array.isArray(post.categories) && post.categories[0] ? post.categories[0].slug : null
    const isRestricted = categorySlug === 'khuyen-nghi'

    let isAuthorized = false
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'admin' || profile?.role === 'pro') {
            isAuthorized = true
        }
    }

    // Even if not authorized, if it's NOT a restricted category, they can see it
    const canSeeContent = !isRestricted || isAuthorized

    // Format date
    const date = new Date(post.created_at).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8 text-center">
                {Array.isArray(post.categories) && post.categories[0] && (
                    <Badge className="mb-4">{post.categories[0].name}</Badge>
                )}
                <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

                <div className="flex items-center justify-center gap-6 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{Array.isArray(post.profiles) && post.profiles[0] ? post.profiles[0].username : 'Tác giả'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>{(post.view_count || 0).toLocaleString('vi-VN')} lượt xem</span>
                    </div>
                </div>

                {/* View Counter - increments on page load */}
                <ViewCounter postId={post.id} />
            </div>

            {post.cover_image && (
                <div className="aspect-video w-full overflow-hidden rounded-xl mb-10 bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none mb-12 relative">
                {canSeeContent ? (
                    <>
                        {typeof post.content === 'string' ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : (
                            <pre className="bg-muted p-4 rounded overflow-auto">
                                {JSON.stringify(post.content, null, 2)}
                            </pre>
                        )}
                    </>
                ) : (
                    <div className="bg-muted/50 rounded-xl p-8 border-2 border-dashed border-primary/20 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Lock className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                        <div className="max-w-md mx-auto space-y-3">
                            <h3 className="text-2xl font-bold italic">Nội dung giới hạn</h3>
                            <p className="text-muted-foreground">
                                Bài viết này thuộc danh mục <strong>khuyến nghị đặc biệt</strong> dành riêng cho khách hàng VIP.
                                Vui lòng nâng cấp tài khoản để xem chi tiết các phân tích và cơ hội đầu tư.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" className="font-bold px-8 shadow-lg shadow-primary/20" asChild>
                                <Link href="/pricing">Nâng cấp Premium ngay</Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/contact">Liên hệ hỗ trợ</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mb-12">
                    {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">#{tag}</Badge>
                    ))}
                </div>
            )}

            <CommentSection postId={post.id} />
        </article>
    )
}
