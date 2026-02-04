'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface ViewCounterProps {
    postId: string
}

export function ViewCounter({ postId }: ViewCounterProps) {
    useEffect(() => {
        const incrementView = async () => {
            const supabase = createClient()

            // Check if this post was already viewed in this session
            const viewedPosts = sessionStorage.getItem('viewedPosts')
            const viewedArray = viewedPosts ? JSON.parse(viewedPosts) : []

            if (!viewedArray.includes(postId)) {
                // Increment view count
                await supabase.rpc('increment_view_count', { post_id: postId })

                // Mark as viewed in this session
                viewedArray.push(postId)
                sessionStorage.setItem('viewedPosts', JSON.stringify(viewedArray))
            }
        }

        incrementView()
    }, [postId])

    return null // This component doesn't render anything
}
