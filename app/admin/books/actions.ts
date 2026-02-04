
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createBook(formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const author = formData.get('author') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const cover_image = formData.get('cover_image') as string
    const pdf_url = formData.get('pdf_url') as string
    const purchase_url = formData.get('purchase_url') as string
    const is_free = formData.get('is_free') === 'on'

    const { error } = await supabase
        .from('books')
        .insert({
            title,
            author,
            description,
            price,
            cover_image,
            pdf_url,
            purchase_url,
            is_free
        })

    if (error) {
        console.error('Error creating book:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/books')
    revalidatePath('/books')
    redirect('/admin/books')
}

export async function updateBook(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const author = formData.get('author') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const cover_image = formData.get('cover_image') as string
    const pdf_url = formData.get('pdf_url') as string
    const purchase_url = formData.get('purchase_url') as string
    const is_free = formData.get('is_free') === 'on'

    const { error } = await supabase
        .from('books')
        .update({
            title,
            author,
            description,
            price,
            cover_image,
            pdf_url,
            purchase_url,
            is_free,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating book:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/books')
    revalidatePath('/books')
    redirect('/admin/books')
}

export async function deleteBook(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting book:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/books')
    revalidatePath('/books')
    return { success: true }
}

