
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditBookClient from './edit-book-client'

export default async function EditBookPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    const { data: book } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

    if (!book) {
        notFound()
    }

    return <EditBookClient book={book} />
}
