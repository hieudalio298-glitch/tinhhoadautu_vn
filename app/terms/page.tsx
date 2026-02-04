
export default function TermsPage() {
    const sections = [
        {
            title: "1. Chấp nhận các điều khoản",
            content: "Bằng việc truy cập và sử dụng StockBlog.vn, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản và Điều kiện sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng trang web của chúng tôi."
        },
        {
            title: "2. Quyền sở hữu trí tuệ",
            content: "Tất cả nội dung trên StockBlog.vn, bao gồm bài viết, biểu đồ, thiết kế, logo và hình ảnh, là tài sản của StockBlog hoặc các bên cấp phép và được bảo hộ bởi luật bản quyền Việt Nam và quốc tế. Việc sao chép nội dung khi chưa được sự đồng ý bằng văn bản là vi phạm pháp luật."
        },
        {
            title: "3. Tuyên bố miễn trừ trách nhiệm",
            content: "Các bài viết, phân tích và khuyến nghị trên StockBlog.vn chỉ mang tính chất tham khảo. Đầu tư vào thị trường chứng khoán luôn tiềm ẩn rủi ro. Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính nào phát sinh từ việc sử dụng thông tin trên trang web này. Nhà đầu tư nên tự chịu trách nhiệm về quyết định của mình hoặc tham vấn ý kiến chuyên gia tài chính độc lập."
        },
        {
            title: "4. Tài khoản người dùng",
            content: "Khi đăng ký tài khoản (đặc biệt là gói VIP), bạn có trách nhiệm bảo mật thông tin đăng nhập cá nhân. Chúng tôi có quyền tạm khóa hoặc xóa tài khoản nếu phát hiện hành vi chia sẻ tài khoản hoặc vi phạm các quy tắc cộng đồng."
        },
        {
            title: "5. Chính sách bảo mật",
            content: "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu của bạn sẽ chỉ được sử dụng để cung cấp dịch vụ tốt hơn và không bao giờ được bán cho bên thứ ba khi chưa có sự cho phép của bạn."
        }
    ]

    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl shadow-slate-100 border relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-3xl"></div>

                <h1 className="text-4xl font-black mb-4 text-slate-900 tracking-tight italic">
                    Điều khoản <span className="text-primary italic">Sử dụng</span>
                </h1>
                <p className="text-muted-foreground mb-12 italic border-l-4 border-primary/20 pl-4 py-1">
                    Cập nhật lần cuối: Ngày 04 tháng 02 năm 2024
                </p>

                <div className="space-y-12">
                    {sections.map((section, index) => (
                        <section key={index} className="space-y-4">
                            <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-muted/30 rounded-2xl border border-dashed border-primary/20">
                    <h3 className="font-bold mb-2">Thắc mắc về điều khoản?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Nếu bạn có bất kỳ câu hỏi nào liên quan đến Điều khoản sử dụng này, vui lòng liên hệ với chúng tôi qua email: <span className="text-primary font-bold">contact@stockblog.vn</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
