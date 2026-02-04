'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function processUpgradeRequest(requestId: string, userId: string, planType: string, action: 'approve' | 'reject') {
    const supabase = await createClient()

    // Safety check: is requester an admin?
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return { error: 'Access denied' }

    if (action === 'approve') {
        // 1. Update user role
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: planType })
            .eq('id', userId)

        if (profileError) return { error: 'Failed to update user role: ' + profileError.message }

        // 2. Mark request as approved
        await supabase
            .from('upgrade_requests')
            .update({ status: 'approved' })
            .eq('id', requestId)
    } else {
        // Mark request as rejected
        await supabase
            .from('upgrade_requests')
            .update({ status: 'rejected' })
            .eq('id', requestId)
    }

    revalidatePath('/admin/upgrades')
    return { success: true }
}
