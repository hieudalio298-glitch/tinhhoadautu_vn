'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitContactForm(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
        return { error: 'Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Nội dung).' }
    }

    const { error } = await supabase
        .from('contact_submissions')
        .insert({
            name,
            email,
            phone,
            subject,
            message,
            status: 'unread'
        })

    if (error) {
        console.error('Error submitting contact form:', error)
        return { error: 'Lỗi khi gửi phản hồi: ' + error.message }
    }

    revalidatePath('/admin/contacts')
    return { success: true }
}
