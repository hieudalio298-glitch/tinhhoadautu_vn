
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface Comment {
    id: string
    content: string
    created_at: string
    user_id: string
    profiles: {
        username: string | null
        avatar_url: string | null
    }[] | null // Supabase returns array for relations
}

export function CommentSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const fetchComments = async () => {
            const { data } = await supabase
                .from('comments')
                .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            username,
            avatar_url
          )
        `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true })

            if (data) {
                // Cast the data to match our type structure
                setComments(data as any[])
            }
        }

        fetchComments()

        // Subscribe to realtime changes
        const channel = supabase
            .channel('realtime_comments')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `post_id=eq.${postId}`,
                },
                async (payload) => {
                    // Fetch the new comment with profile info
                    const { data } = await supabase
                        .from('comments')
                        .select(`
              id,
              content,
              created_at,
              user_id,
              profiles (
                username,
                avatar_url
              )
            `)
                        .eq('id', payload.new.id)
                        .single()

                    if (data) {
                        setComments((prev) => [...prev, data as any])
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [postId, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert('Vui lòng đăng nhập để bình luận!')
            setLoading(false)
            return
        }

        const { error } = await supabase.from('comments').insert({
            post_id: postId,
            user_id: user.id,
            content: newComment,
        })

        if (error) {
            alert('Có lỗi xảy ra: ' + error.message)
        } else {
            setNewComment('')
        }
        setLoading(false)
    }

    return (
        <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Bình luận ({comments.length})</h3>

            <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                        <Avatar>
                            <AvatarImage src={comment.profiles?.[0]?.avatar_url || ''} />
                            <AvatarFallback>{comment.profiles?.[0]?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{comment.profiles?.[0]?.username || 'Người dùng ẩn danh'}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi })}
                                </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder="Viết bình luận của bạn..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                />
                <Button type="submit" disabled={loading}>
                    {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
            </form>
        </div>
    )
}
