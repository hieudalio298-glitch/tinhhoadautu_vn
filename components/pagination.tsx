
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl: string
    searchParams: { [key: string]: string | string[] | undefined }
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams()
        Object.entries(searchParams).forEach(([key, value]) => {
            if (key !== 'page' && typeof value === 'string') {
                params.set(key, value)
            }
        })
        params.set('page', page.toString())
        return `${baseUrl}?${params.toString()}`
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={createPageUrl(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span><ChevronLeft className="h-4 w-4" /></span>
                )}
            </Button>

            <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
            </span>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={createPageUrl(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span><ChevronRight className="h-4 w-4" /></span>
                )}
            </Button>
        </div>
    )
}
