export const dynamic = 'force-dynamic'

import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateSettings } from './actions'

async function getSetting(supabase: any, key: string) {
    const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single()

    if (!data?.value) return ''

    // Try to parse as JSON, if fails return raw value
    try {
        return JSON.parse(data.value)
    } catch {
        return data.value
    }
}

export default async function SettingsPage({ searchParams }: { searchParams: any }) {
    const supabase = await createClient()
    const params = await searchParams

    // Fetch current settings
    const siteName = await getSetting(supabase, 'site_name')
    const siteDescription = await getSetting(supabase, 'site_description')
    const postsPerPage = await getSetting(supabase, 'posts_per_page')
    const allowComments = await getSetting(supabase, 'allow_comments')
    const contactEmail = await getSetting(supabase, 'contact_email')
    const facebookUrl = await getSetting(supabase, 'facebook_url')
    const twitterUrl = await getSetting(supabase, 'twitter_url')
    const youtubeUrl = await getSetting(supabase, 'youtube_url')
    const bankName = await getSetting(supabase, 'bank_name')
    const bankAccountNumber = await getSetting(supabase, 'bank_account_number')
    const bankAccountName = await getSetting(supabase, 'bank_account_name')
    const aboutStory = await getSetting(supabase, 'about_story')
    const contactPhone = await getSetting(supabase, 'contact_phone')
    const contactAddress = await getSetting(supabase, 'contact_address')
    const smtpHost = await getSetting(supabase, 'smtp_host') || 'smtp.gmail.com'
    const smtpPort = await getSetting(supabase, 'smtp_port') || '587'
    const smtpUser = await getSetting(supabase, 'smtp_user')
    const smtpPass = await getSetting(supabase, 'smtp_pass')

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Cài đặt</h1>

            {params?.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded">
                    ✅ Cài đặt đã được lưu thành công!
                </div>
            )}

            <form action={updateSettings} className="space-y-6">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin chung</CardTitle>
                        <CardDescription>Cài đặt thông tin cơ bản của website</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="site_name">Tên website</Label>
                            <Input id="site_name" name="site_name" defaultValue={siteName} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="site_description">Mô tả website</Label>
                            <Textarea id="site_description" name="site_description" defaultValue={siteDescription} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_email">Email liên hệ</Label>
                            <Input id="contact_email" name="contact_email" type="email" defaultValue={contactEmail} />
                        </div>
                    </CardContent>
                </Card>

                {/* Display Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hiển thị</CardTitle>
                        <CardDescription>Tùy chỉnh giao diện và hiển thị</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="posts_per_page">Số bài viết mỗi trang</Label>
                            <Input id="posts_per_page" name="posts_per_page" type="number" defaultValue={postsPerPage} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="allow_comments" name="allow_comments" defaultChecked={allowComments} className="h-4 w-4" />
                            <Label htmlFor="allow_comments">Cho phép bình luận</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mạng xã hội</CardTitle>
                        <CardDescription>Liên kết đến các kênh truyền thông</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="facebook_url">Facebook URL</Label>
                            <Input id="facebook_url" name="facebook_url" type="url" placeholder="https://facebook.com/..." defaultValue={facebookUrl} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="twitter_url">Twitter/X URL</Label>
                            <Input id="twitter_url" name="twitter_url" type="url" placeholder="https://twitter.com/..." defaultValue={twitterUrl} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube_url">YouTube URL</Label>
                            <Input id="youtube_url" name="youtube_url" type="url" placeholder="https://youtube.com/..." defaultValue={youtubeUrl} />
                        </div>
                    </CardContent>
                </Card>

                {/* Page Content Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Nội dung trang</CardTitle>
                        <CardDescription>Cài đặt nội dung cho trang Giới thiệu và Liên hệ</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="about_story">Câu chuyện của chúng tôi (Trang Giới thiệu)</Label>
                            <Textarea id="about_story" name="about_story" defaultValue={aboutStory} rows={6} placeholder="Nhập nội dung giới thiệu về StockBlog..." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">Số điện thoại Hotline</Label>
                                <Input id="contact_phone" name="contact_phone" defaultValue={contactPhone} placeholder="09xx.xxx.xxx" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_address">Địa chỉ văn phòng</Label>
                                <Input id="contact_address" name="contact_address" defaultValue={contactAddress} placeholder="Tòa nhà Landmark 81..." />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thanh toán</CardTitle>
                        <CardDescription>Cấu hình thông tin nhận thanh toán nâng cấp hội viên</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank_name">Tên ngân hàng (ví dụ: MB Bank, Vietcombank...)</Label>
                            <Input id="bank_name" name="bank_name" defaultValue={bankName} placeholder="MB BANK" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_account_number">Số tài khoản</Label>
                            <Input id="bank_account_number" name="bank_account_number" defaultValue={bankAccountNumber} placeholder="0000123456789" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bank_account_name">Chủ tài khoản (Tên in hoa không dấu)</Label>
                            <Input id="bank_account_name" name="bank_account_name" defaultValue={bankAccountName} placeholder="NGUYEN VAN A" />
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            * Mã QR sẽ được tự động tạo dựa trên số tài khoản và tên ngân hàng bạn nhập ở trên.
                        </p>
                    </CardContent>
                </Card>

                {/* Email (SMTP) Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cấu hình Email (SMTP)</CardTitle>
                        <CardDescription>Cài đặt máy chủ gửi email tự động (Cảm ơn khách hàng, thông báo...)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="smtp_host">SMTP Host</Label>
                                <Input id="smtp_host" name="smtp_host" defaultValue={smtpHost} placeholder="smtp.gmail.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smtp_port">SMTP Port</Label>
                                <Input id="smtp_port" name="smtp_port" type="number" defaultValue={smtpPort} placeholder="587" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtp_user">Email gửi đi (User)</Label>
                            <Input id="smtp_user" name="smtp_user" defaultValue={smtpUser} placeholder="your-email@gmail.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smtp_pass">Mật khẩu ứng dụng (App Password)</Label>
                            <Input id="smtp_pass" name="smtp_pass" type="password" defaultValue={smtpPass} placeholder="••••••••••••••••" />
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[10px] text-blue-700">
                            <p className="font-bold mb-1">Hướng dẫn sử dụng Gmail:</p>
                            <ol className="list-decimal pl-4 space-y-1">
                                <li>Bật xác minh 2 bước cho tài khoản Google.</li>
                                <li>Truy cập "Mật khẩu ứng dụng" (App Passwords) trong cài đặt bảo mật.</li>
                                <li>Tạo mật khẩu mới cho ứng dụng "Thư" và sao chép mã 16 ký tự vào ô trên.</li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" size="lg">Lưu cài đặt</Button>
            </form>
        </div>
    )
}
