
import { createClient } from '@/utils/supabase/server'
import BooksClient from './books-client'

export default async function BooksPage() {
    const supabase = await createClient()

    const { data: books } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

    return <BooksClient initialBooks={books || []} />
}
