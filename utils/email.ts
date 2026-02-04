
import nodemailer from 'nodemailer'
import { createClient } from '@/utils/supabase/server'

async function getEmailSetting(supabase: any, key: string) {
    const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single()

    if (!data?.value) return null
    try {
        return JSON.parse(data.value)
    } catch {
        return data.value
    }
}

export async function sendThankYouEmail(customerEmail: string, customerName: string, bookTitle: string) {
    const supabase = await createClient()

    // Fetch SMTP settings from DB
    const dbHost = await getEmailSetting(supabase, 'smtp_host')
    const dbPort = await getEmailSetting(supabase, 'smtp_port')
    const dbUser = await getEmailSetting(supabase, 'smtp_user')
    const dbPass = await getEmailSetting(supabase, 'smtp_pass')

    // Clean strings (remove leading/trailing spaces, and ALL spaces for password)
    const cleanHost = (dbHost || process.env.SMTP_HOST || 'smtp.gmail.com').trim()
    const cleanPort = Number((dbPort || process.env.SMTP_PORT || '587').toString().trim())
    const cleanUser = (dbUser || process.env.SMTP_USER || '').trim()
    const cleanPass = (dbPass || process.env.SMTP_PASS || '').replace(/\s+/g, '') // Remove all spaces

    const smtpConfig = {
        host: cleanHost,
        port: cleanPort === 465 ? 465 : cleanPort, // Support standard secure port
        secure: cleanPort === 465, // Use SSL/TLS for 465
        auth: {
            user: cleanUser,
            pass: cleanPass,
        },
    }

    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
        console.error('SMTP credentials missing. Cannot send thank you email.')
        return { error: 'SMTP credentials missing' }
    }

    console.log('--- EMAIL DELIVERY DEBUG ---')
    console.log('Target Email:', customerEmail)
    console.log('SMTP Config:', { host: cleanHost, port: cleanPort, user: cleanUser, secure: smtpConfig.secure })
    console.log('SMTP Pass Length:', cleanPass.length)
    console.log('---------------------------')

    const transporter = nodemailer.createTransport(smtpConfig)

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #000; color: #fff; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">TINH HOA ĐẦU TƯ</h1>
                <p style="margin: 10px 0 0; opacity: 0.8; font-style: italic;">Nâng tầm tri thức đầu tư</p>
            </div>
            
            <div style="padding: 40px; color: #333; line-height: 1.6;">
                <h2 style="color: #000; margin-top: 0;">Chào ${customerName},</h2>
                <p>Lời đầu tiên, đội ngũ <strong>Tinh Hoa Đầu Tư</strong> xin chân thành cảm ơn bạn đã tin tưởng lựa chọn tri thức từ chúng tôi.</p>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #000; margin: 25px 0;">
                    <p style="margin: 0; color: #666; font-size: 13px; text-transform: uppercase; font-bold">Sách bạn đã đặt mua:</p>
                    <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #000;">${bookTitle}</p>
                </div>
                
                <p>Đơn hàng của bạn đã được chúng tôi xác nhận <strong>Hoàn thành</strong>. Quyển sách vật lý sẽ sớm được đóng gói cẩn thận và gửi tới địa chỉ của bạn trong thời gian ngắn nhất.</p>
                
                <p>Trong lúc chờ đợi sách giấy, nếu bạn có bất kỳ thắc mắc nào về các phân tích thị trường hoặc cần hỗ trợ về tài khoản PRO, đừng ngần ngại phản hồi lại email này hoặc liên lạc qua hotline của chúng tôi.</p>
                
                <div style="margin-top: 40px; border-top: 1px solid #eee; pt: 20px;">
                    <p style="margin-bottom: 5px;">Chúc bạn có những thương vụ đầu tư thành công!</p>
                    <p style="font-weight: bold; margin-top: 0;">Tinh Hoa Đầu Tư Team</p>
                </div>
            </div>
            
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                <p style="margin: 0;">&copy; 2026 Tinh Hoa Đầu Tư. All rights reserved.</p>
                <p style="margin: 5px 0 0;">Lưu ý: Đây là email tự động. Vui lòng không trả lời email này.</p>
            </div>
        </div>
    `

    try {
        await transporter.sendMail({
            from: `"TINH HOA ĐẦU TƯ" <${smtpConfig.auth.user}>`,
            to: customerEmail,
            subject: `[Tinh Hoa Đầu Tư] Xác nhận đơn hàng thành công - ${bookTitle}`,
            html: htmlContent,
        })
        return { success: true }
    } catch (error: any) {
        console.error('Error sending email:', error)
        return { error: error.message }
    }
}
