
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const cover_image = formData.get('cover_image') as string // URL from client upload
    const category_id = formData.get('category_id') as string
    const published = formData.get('published') === 'on'

    const { error } = await supabase.from('posts').insert({
        title,
        slug,
        content, // Storing HTML for simplicity
        excerpt,
        cover_image,
        category_id: category_id || null,
        author_id: user.id,
        published,
        tags: [] // Todo: Parse tags
    })

    if (error) {
        console.error('Error creating post:', error)
        // For simple form actions without useFormState, throwing might be better or handling differently
        // But to match the type expected by <form action={}>, it should return void or Promise<void>
        // redirect throws an error internally, so that's fine.
        // We'll redirect to error page on failure for now to satisfy type
        redirect('/admin/posts?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/')
    revalidatePath('/blog')
    redirect('/admin/posts')
}

export async function updatePost(postId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const cover_image = formData.get('cover_image') as string
    const category_id = formData.get('category_id') as string
    const published = formData.get('published') === 'on'

    const { error } = await supabase
        .from('posts')
        .update({
            title,
            slug,
            content,
            excerpt,
            cover_image,
            category_id: category_id || null,
            published,
            updated_at: new Date().toISOString(),
        })
        .eq('id', postId)

    if (error) {
        console.error('Error updating post:', error)
        redirect('/admin/posts?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/')
    revalidatePath('/blog')
    revalidatePath(`/blog/${slug}`)
    redirect('/admin/posts')
}
