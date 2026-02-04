
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Lock } from "lucide-react"

// Define a type for the post data we expect
interface PostCardProps {
    post: {
        id: string
        title: string
        slug: string
        excerpt: string | null
        cover_image: string | null
        created_at: string
        view_count?: number
        categories?: {
            name: string
            slug: string
        }[] | null
    }
}

export function PostCard({ post }: PostCardProps) {
    return (
        <div className="group flex flex-col h-full bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {post.cover_image && (
                <div className="aspect-[16/10] w-full overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {Array.isArray(post.categories) && post.categories[0] && (
                        <div className="absolute top-4 left-4">
                            <Badge className={`backdrop-blur-md border-none px-3 py-1 font-bold text-[10px] uppercase tracking-wider ${post.categories[0].slug === 'khuyen-nghi' ? "bg-red-500/90 text-white" : "bg-primary/90 text-white"}`}>
                                {post.categories[0].slug === 'khuyen-nghi' && <Lock className="h-2.5 w-2.5 mr-1" />}
                                {post.categories[0].name}
                            </Badge>
                        </div>
                    )}
                </div>
            )}

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count || 0} lượt xem
                    </span>
                </div>

                <Link href={`/blog/${post.slug}`} className="block mb-3">
                    <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-[1.3] group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-grow">
                    {post.excerpt || "Khám phá những phân tích sâu sắc về thị trường chứng khoán cùng StockBlog..."}
                </p>

                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-primary group/link"
                >
                    Đọc chi tiết
                    <div className="w-6 h-[2px] bg-primary group-hover/link:w-10 transition-all duration-300" />
                </Link>
            </div>
        </div>
    )
}
