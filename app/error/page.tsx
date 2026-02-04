
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

// Define Params type for Next.js 15+
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ErrorPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const resolvedSearchParams = await searchParams
    const message = typeof resolvedSearchParams.message === 'string'
        ? resolvedSearchParams.message
        : "Đã có lỗi xảy ra trong quá trình xác thực."

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 text-center">
            <div className="bg-destructive/10 p-4 rounded-full mb-6">
                <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Đã có lỗi xảy ra</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                {message}
            </p>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/">Trang chủ</Link>
                </Button>
                <Button asChild>
                    <Link href="/login">Thử lại</Link>
                </Button>
            </div>
        </div>
    )
}
