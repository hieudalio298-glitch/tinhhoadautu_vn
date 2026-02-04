'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const settings = [
        { key: 'site_name', value: formData.get('site_name') as string },
        { key: 'site_description', value: formData.get('site_description') as string },
        { key: 'posts_per_page', value: parseInt(formData.get('posts_per_page') as string) },
        { key: 'allow_comments', value: formData.get('allow_comments') === 'on' },
        { key: 'contact_email', value: formData.get('contact_email') as string },
        { key: 'facebook_url', value: formData.get('facebook_url') as string },
        { key: 'twitter_url', value: formData.get('twitter_url') as string },
        { key: 'youtube_url', value: formData.get('youtube_url') as string },
        { key: 'bank_name', value: formData.get('bank_name') as string },
        { key: 'bank_account_number', value: formData.get('bank_account_number') as string },
        { key: 'bank_account_name', value: formData.get('bank_account_name') as string },
        { key: 'about_story', value: formData.get('about_story') as string },
        { key: 'contact_phone', value: formData.get('contact_phone') as string },
        { key: 'contact_address', value: formData.get('contact_address') as string },
        { key: 'smtp_host', value: formData.get('smtp_host') as string },
        { key: 'smtp_port', value: formData.get('smtp_port') as string },
        { key: 'smtp_user', value: formData.get('smtp_user') as string },
        { key: 'smtp_pass', value: formData.get('smtp_pass') as string },
    ]

    for (const setting of settings) {
        await supabase
            .from('site_settings')
            .upsert({
                key: setting.key,
                value: JSON.stringify(setting.value),
                updated_at: new Date().toISOString()
            }, { onConflict: 'key' })
    }

    revalidatePath('/admin/settings')
    redirect('/admin/settings?success=true')
}
