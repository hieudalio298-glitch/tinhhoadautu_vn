'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function requestUpgrade(planType: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Vui lòng đăng nhập để nâng cấp tài khoản.' }
    }

    // Check if there is already a pending request
    const { data: existing } = await supabase
        .from('upgrade_requests')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .single()

    if (existing) {
        return { error: 'Bạn đã có một yêu cầu đang chờ xử lý. Chúng tôi sẽ liên hệ sớm!' }
    }

    const { error } = await supabase
        .from('upgrade_requests')
        .insert({
            user_id: user.id,
            email: user.email!,
            plan_type: planType,
            status: 'pending'
        })

    if (error) {
        return { error: 'Lỗi khi gửi yêu cầu: ' + error.message }
    }

    revalidatePath('/pricing')
    return { success: true }
}
