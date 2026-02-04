
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBookOrder(
    bookId: string,
    amount: number,
    customerName: string,
    customerPhone: string,
    customerAddress: string,
    customerEmail: string
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Vui lòng đăng nhập để thực hiện mua sách.' }
    }

    const { error } = await supabase
        .from('book_orders')
        .insert({
            user_id: user.id,
            book_id: bookId,
            amount,
            status: 'pending',
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_address: customerAddress,
            customer_email: customerEmail
        })

    if (error) {
        console.error('Error creating book order:', error)
        return { error: 'Lỗi khi gửi yêu cầu mua sách: ' + error.message }
    }

    revalidatePath('/admin/book-orders')
    return { success: true }
}

import { sendThankYouEmail } from '@/utils/email'

export async function updateBookOrderStatus(orderId: string, status: string) {
    const supabase = await createClient()

    // 1. Update the order status
    const { error } = await supabase
        .from('book_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)

    if (error) {
        console.error('Error updating order status:', error)
        return { error: error.message }
    }

    // 2. If completed, send thank you email
    if (status === 'completed') {
        const { data: order } = await supabase
            .from('book_orders')
            .select('customer_name, customer_email, books(title)')
            .eq('id', orderId)
            .single()

        if (order && order.customer_email) {
            console.log(`Attempting to send thank you email to: ${order.customer_email}`)
            const emailResult = await sendThankYouEmail(
                order.customer_email,
                order.customer_name || 'Quý khách',
                (order.books as any)?.title || 'Sách tại Tinh Hoa Đầu Tư'
            )
            if (emailResult.error) {
                console.error('Email sending failed:', emailResult.error)
            } else {
                console.log('Email sent successfully!')
            }
        } else {
            console.warn('Order found but email empty, cannot send:', orderId)
        }
    }

    revalidatePath('/admin/book-orders')
    return { success: true }
}


