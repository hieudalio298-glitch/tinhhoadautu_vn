import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditPostClient from './edit-post-client'

type Params = Promise<{ id: string }>

export default async function EditPostPage({ params }: { params: Params }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !post) {
        notFound()
    }

    return <EditPostClient post={post} />
}
