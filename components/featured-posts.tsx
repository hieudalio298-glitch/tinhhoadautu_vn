
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PostCard } from '@/components/post-card'
import { motion } from 'framer-motion'

export function FeaturedPosts() {
    const [posts, setPosts] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        async function fetchPosts() {
            const { data } = await supabase
                .from('posts')
                .select(`
                    id, title, slug, excerpt, cover_image, created_at, view_count,
                    categories (name, slug)
                `)
                .eq('published', true)
                .order('created_at', { ascending: false })
                .limit(3)
            if (data) setPosts(data)
        }
        fetchPosts()
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <section className="py-24 relative overflow-hidden bg-slate-50">
            {/* Subtle Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
                        Bài viết
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto font-medium">
                        Cập nhật những kiến thức và nhận định thị trường mới nhất từ đội ngũ phân tích của Tinh Hoa Đầu Tư.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {posts && posts.length > 0 ? (
                        posts.map((post: any) => (
                            <motion.div key={post.id} variants={itemVariants}>
                                <PostCard post={post} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 opacity-50 font-bold">
                            Đang tải các bài viết tâm huyết...
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    )
}

