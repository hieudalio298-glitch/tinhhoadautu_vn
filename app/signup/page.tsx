
import { signup } from '../login/actions'
import { Button } from "@/components/ui/button"

export default function SignupPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Đăng ký</h1>
                    <p className="text-muted-foreground">Tạo tài khoản mới để tham gia cộng đồng</p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-3 py-2 border rounded-md bg-background"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Mật khẩu</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-3 py-2 border rounded-md bg-background"
                        />
                    </div>
                    <Button formAction={signup} className="w-full">Đăng ký</Button>
                </form>

                <div className="text-center text-sm">
                    Đã có tài khoản? <a href="/login" className="underline hover:text-primary">Đăng nhập</a>
                </div>
            </div>
        </div>
    )
}
