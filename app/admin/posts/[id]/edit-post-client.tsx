'use client'

import { useState, useEffect } from 'react'
import { Editor } from '@/components/editor'
import { updatePost } from '../actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'

interface EditPostClientProps {
    post: {
        id: string
        title: string
        slug: string
        content: any
        excerpt: string | null
        cover_image: string | null
        category_id: string | null
        published: boolean
    }
}

export default function EditPostClient({ post }: EditPostClientProps) {
    const [content, setContent] = useState(typeof post.content === 'string' ? post.content : JSON.stringify(post.content))
    const [isUploading, setIsUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState(post.cover_image || '')
    const [categories, setCategories] = useState<any[]>([])
    const router = useRouter()
    const supabase = createClient()

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        try {
            // Compress and resize image
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1600,
                useWebWorker: true
            }
            const compressedFile = await imageCompression(file, options)

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('blog-assets')
                .upload(filePath, compressedFile)

            if (uploadError) {
                alert('Upload failed: ' + uploadError.message)
                setIsUploading(false)
                return
            }

            const { data: { publicUrl } } = supabase.storage
                .from('blog-assets')
                .getPublicUrl(filePath)

            setImageUrl(publicUrl)
        } catch (error: any) {
            alert('Lỗi xử lý ảnh: ' + error.message)
        }

        setIsUploading(false)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await updatePost(post.id, formData)
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa bài viết</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input id="title" name="title" required defaultValue={post.title} placeholder="Nhập tiêu đề bài viết..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input id="slug" name="slug" defaultValue={post.slug} placeholder="duong-dan-url-bai-viet" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Mô tả ngắn</Label>
                    <Input id="excerpt" name="excerpt" defaultValue={post.excerpt || ''} placeholder="Mô tả ngắn cho SEO và thẻ bài viết..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category_id">Danh mục</Label>
                    <select
                        id="category_id"
                        name="category_id"
                        defaultValue={post.category_id || ''}
                        className="w-full px-3 py-2 border rounded-md bg-background"
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cover_image">Ảnh bìa</Label>
                    <div className="flex gap-4 items-end">
                        <Input
                            id="cover_image_file"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                        />
                        {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                    </div>
                    <input type="hidden" name="cover_image" value={imageUrl} />
                    {imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="Preview" className="h-40 w-auto object-cover rounded-md border mt-2" />
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Nội dung</Label>
                    <Editor content={content} onChange={setContent} />
                    <input type="hidden" name="content" value={content} />
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="published" name="published" defaultChecked={post.published} className="h-4 w-4" />
                    <Label htmlFor="published">Xuất bản</Label>
                </div>

                <div className="flex gap-4">
                    <Button type="submit">Cập nhật bài viết</Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
                </div>
            </form>
        </div>
    )
}
