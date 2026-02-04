
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateBook, deleteBook } from '../actions'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, FileText, Image as ImageIcon, Trash2 } from 'lucide-react'

export default function EditBookClient({ book }: { book: any }) {
    const [isUploading, setIsUploading] = useState(false)
    const [isPdfUploading, setIsPdfUploading] = useState(false)
    const [coverUrl, setCoverUrl] = useState(book.cover_image || '')
    const [pdfUrl, setPdfUrl] = useState(book.pdf_url || '')
    const [isFree, setIsFree] = useState(book.is_free || false)
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
        const result = await updateBook(book.id, formData)
        if (result?.error) {
            alert(result.error)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xóa quyển sách này?')) return
        const result = await deleteBook(book.id)
        if (result.success) {
            router.push('/admin/books')
        } else {
            alert(result.error)
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => router.back()} size="sm"> Quay lại</Button>
                    <h1 className="text-3xl font-bold">Chỉnh sửa sách</h1>
                </div>
                <Button variant="destructive" onClick={handleDelete} size="sm">
                    <Trash2 className="h-4 w-4 mr-2" /> Xóa sách
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-6 border rounded-xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tên sách</Label>
                        <Input id="title" name="title" required defaultValue={book.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">Tác giả</Label>
                        <Input id="author" name="author" defaultValue={book.author} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Mô tả sách</Label>
                    <Textarea id="description" name="description" rows={4} defaultValue={book.description} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">Giá bán (VNĐ)</Label>
                        <Input id="price" name="price" type="number" defaultValue={book.price} />
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
                                <Input id="purchase_url" name="purchase_url" defaultValue={book.purchase_url} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button type="submit" size="lg" className="px-10 font-bold" disabled={isUploading || isPdfUploading}>
                        Cập nhật sách
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Hủy</Button>
                </div>
            </form>
        </div>
    )
}
