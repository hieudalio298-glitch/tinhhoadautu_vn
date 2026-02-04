
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createBook } from '../actions'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, FileText, Image as ImageIcon } from 'lucide-react'

export default function NewBookClient() {
    const [isUploading, setIsUploading] = useState(false)
    const [isPdfUploading, setIsPdfUploading] = useState(false)
    const [coverUrl, setCoverUrl] = useState('')
    const [pdfUrl, setPdfUrl] = useState('')
    const [isFree, setIsFree] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
        const file = e.target.files?.[0]
        if (!file) return

        if (type === 'image') setIsUploading(true)
        else setIsPdfUploading(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${type}s/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('blog-assets')
                .upload(filePath, file)

            if (uploadError) {
                alert('Upload failed: ' + uploadError.message)
                return
            }

            const { data: { publicUrl } } = supabase.storage
                .from('blog-assets')
                .getPublicUrl(filePath)

            if (type === 'image') setCoverUrl(publicUrl)
            else setPdfUrl(publicUrl)
        } catch (error: any) {
            alert('Lỗi upload: ' + error.message)
        } finally {
            if (type === 'image') setIsUploading(false)
            else setIsPdfUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const result = await createBook(formData)
        if (result?.error) {
            alert(result.error)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" onClick={() => router.back()} size="sm"> Quay lại</Button>
                <h1 className="text-3xl font-bold">Thêm sách mới</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 border rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tên sách</Label>
                        <Input id="title" name="title" required placeholder="Ví dụ: Làm giàu từ chứng khoán" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Tác giả</Label>
                        <Input id="author" name="author" placeholder="Ví dụ: William O'Neil" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Mô tả sách</Label>
                    <Textarea id="description" name="description" rows={4} placeholder="Tóm tắt ngắn gọn về nội dung sách..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">Giá bán (VNĐ)</Label>
                        <Input id="price" name="price" type="number" defaultValue="0" />
                        <p className="text-[10px] text-muted-foreground italic">* Để 0 nếu là sách tặng kèm PDF free</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Loại sách</Label>
                        <div className="flex items-center gap-4 h-10">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_free"
                                    checked={isFree}
                                    onChange={(e) => setIsFree(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <span className="text-sm">Có PDF tải về miễn phí</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Cover image upload */}
                    <div className="space-y-3">
                        <Label>Ảnh bìa sách</Label>
                        <div className={`
                            border-2 border-dashed rounded-lg p-4 transition-colors text-center
                            ${coverUrl ? 'border-primary/20 bg-primary/5' : 'border-muted'}
                        `}>
                            {coverUrl ? (
                                <div className="space-y-2">
                                    <img src={coverUrl} alt="Cover" className="h-40 mx-auto object-cover rounded shadow-md" />
                                    <Button type="button" variant="outline" size="sm" onClick={() => setCoverUrl('')}>Thay đổi</Button>
                                </div>
                            ) : (
                                <div className="py-4">
                                    <label className="cursor-pointer flex flex-col items-center gap-2">
                                        <div className="p-3 bg-muted rounded-full">
                                            {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">Click để tải ảnh lên</span>
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>
                        <input type="hidden" name="cover_image" value={coverUrl} />
                    </div>

                    {/* PDF/Purchase links */}
                    <div className="space-y-6">
                        {isFree ? (
                            <div className="space-y-3">
                                <Label>File PDF (Miễn phí)</Label>
                                <div className={`
                                    border-2 border-dashed rounded-lg p-4 transition-colors
                                    ${pdfUrl ? 'border-green-200 bg-green-50' : 'border-muted'}
                                `}>
                                    {pdfUrl ? (
                                        <div className="flex items-center justify-between bg-white p-3 rounded border">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <FileText className="h-5 w-5 text-green-600 shrink-0" />
                                                <span className="text-xs truncate font-medium">Đã tải lên file PDF</span>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => setPdfUrl('')} className="text-destructive h-7">Xóa</Button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex items-center justify-center gap-2 py-4">
                                            {isPdfUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                                            <span className="text-sm text-muted-foreground">Chọn file PDF</span>
                                            <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, 'pdf')} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                <input type="hidden" name="pdf_url" value={pdfUrl} />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="purchase_url">Link mua sách (Tiki/Shopee...)</Label>
                                <Input id="purchase_url" name="purchase_url" placeholder="https://tiki.vn/..." />
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button type="submit" size="lg" className="px-10 font-bold" disabled={isUploading || isPdfUploading}>
                        Lưu thông tin sách
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Hủy</Button>
                </div>
            </form>
        </div>
    )
}
