
import { sendThankYouEmail } from './utils/email.js'

async function test() {
    console.log('Testing email delivery to hieuco298@gmail.com...')
    const result = await sendThankYouEmail(
        'hieuco298@gmail.com',
        'Anh Hiếu',
        'Sách Chứng Khoán (Test Delivery)'
    )

    if (result.success) {
        console.log('✅ SUCCESS: Email has been sent to hieuco298@gmail.com')
    } else {
        console.error('❌ FAILED:', result.error)
    }
}

test()
