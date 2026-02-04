'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export function Analytics() {
    useEffect(() => {
        const trackPageView = async () => {
            const supabase = createClient()
            await supabase.from('analytics').insert({
                path: window.location.pathname
            })
        }

        trackPageView()
    }, [])

    return null
}
