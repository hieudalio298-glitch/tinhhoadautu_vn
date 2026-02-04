
import { createClient } from '@/utils/supabase/server'
import { PostCard } from '@/components/post-card'
import { Pagination } from '@/components/pagination'
import { TopPosts } from '@/components/top-posts'
import { SidebarRegister } from '@/components/sidebar-register'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Lock } from "lucide-react"
import Link from 'next/link'

// Define SearchParams type correctly for Next.js 15+
// In Next.js 15, searchParams is a Promise
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function BlogPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const resolvedSearchParams = await searchParams
    const supabase = await createClient()

    const page = Number(resolvedSearchParams.page) || 1
    const search = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : ''
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : ''

    const itemsPerPage = 9
    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    // Start building the query
    let query = supabase
        .from('posts')
        .select(`
      id,
      title,
      slug,
      excerpt,
      cover_image,
      created_at,
      view_count,
      categories (
        name,
        slug
      )
    `, { count: 'exact' })
        .eq('published', true)

    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    // Note: Filtering by foreign table field (categories.slug) is tricky with simple Supabase syntax
    // Usually requires !inner join. 
    if (category) {
        // simpler workaround if we had category_id, but here filtering by joined table:
        query = query.not('categories', 'is', null) // Ensure category exists
        // This is imperfect without !inner on REST. 
        // Better approach: fetch category ID first or use custom RPC.
        // For now, let's assume we filter by category_id if we have it, or ignore deep filter for MVP simplicity
        // Or, we use the foreign key 'category_id' on posts table if available.
        // Checking schema... I created posts with category_id.

        // Let's first get the category ID from the slug
        const { data: catData } = await supabase.from('categories').select('id').eq('slug', category).single()
        if (catData) {
            query = query.eq('category_id', catData.id)
        }
    }

    const { data: posts, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

    const totalPages = count ? Math.ceil(count / itemsPerPage) : 0

    // Fetch categories for sidebar/filter
    const { data: categories } = await supabase.from('categories').select('*')

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-8">
                    {/* Register Section */}
                    <SidebarRegister />

                    <div>
                        <h3 className="font-bold mb-4">Tìm kiếm</h3>
                        <form className="flex gap-2">
                            <Input
                                name="q"
                                defaultValue={search}
                                placeholder="Tìm bài viết..."
                                className="bg-background"
                            />
                            <Button type="submit" size="icon">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Danh mục</h3>
                        <div className="flex flex-col space-y-2">
                            <Link
                                href="/blog"
                                className={`text-sm ${!category ? 'font-bold text-primary' : 'text-muted-foreground hover:text-primary'}`}
                            >
                                Tất cả
                            </Link>
                            {categories?.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/blog?category=${cat.slug}`}
                                    className={`text-sm flex items-center justify-between ${category === cat.slug ? 'font-bold text-primary' : 'text-muted-foreground hover:text-primary'}`}
                                >
                                    <span>{cat.name}</span>
                                    {cat.slug === 'khuyen-nghi' && <Lock className="h-4 w-4 text-destructive" />}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Posts */}
                    <TopPosts />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">
                            {category ? `Danh mục: ${categories?.find(c => c.slug === category)?.name || category}` : 'Tất cả bài viết'}
                        </h1>
                        {search && <p className="text-muted-foreground mt-2">Kết quả tìm kiếm cho "{search}"</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts && posts.length > 0 ? (
                            posts.map((post: any) => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg bg-muted/20">
                                Không tìm thấy bài viết nào phù hợp.
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            baseUrl="/blog"
                            searchParams={resolvedSearchParams}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
