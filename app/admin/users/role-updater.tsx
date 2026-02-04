'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface RoleUpdaterProps {
    userId: string
    currentRole: string
}

export function RoleUpdater({ userId, currentRole }: RoleUpdaterProps) {
    const supabase = createClient()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value
        if (newRole === currentRole) return

        if (!confirm(`Bạn có chắc muốn thay đổi quyền người dùng thành ${newRole}?`)) {
            e.target.value = currentRole || 'user'
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) {
                alert('Lỗi khi cập nhật quyền: ' + error.message)
            } else {
                router.refresh()
            }
        } catch (err: any) {
            alert('Có lỗi xảy ra: ' + err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <select
            defaultValue={currentRole || 'user'}
            onChange={handleRoleChange}
            disabled={isLoading}
            className="text-xs border rounded px-2 py-1 bg-background"
        >
            <option value="user">Người dùng</option>
            <option value="pro">Hội viên (Pro)</option>
            <option value="admin">Quản trị viên</option>
        </select>
    )
}
