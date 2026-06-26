// api/tracuu.js
export default async function handler(req, res) {
    // Cấu hình các Header cho phép hiển thị tiếng Việt không bị lỗi font và tránh chặn CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const { sbd } = req.query;
    if (!sbd) {
        return res.status(400).json({ error: "Vui lòng nhập Số báo danh" });
    }

    try {
        // Đã điền mã API Key thật từ ảnh 24705.jpg của bạn vào đây
        const SCRAPER_API_KEY = 'dd1b7e049804438b3d2d248090aeb536'; 
        
        // Đường dẫn cổng tra cứu dữ liệu gốc của Sở GD&ĐT Tây Ninh
        const targetUrl = encodeURIComponent(`https://tuyensinh.tayninh.edu.vn/api/tra-cuu/ket-qua?sbd=${sbd}`);
        
        // Gọi qua server giải mã ScraperAPI (sử dụng IP sạch tại Việt Nam và giả lập trình duyệt thật để bypass tường lửa)
        const proxyUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${targetUrl}&render=true&country_code=vn`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
            return res.status(500).json({ error: "Hệ thống kết nối trung gian đang bận, vui lòng thử lại." });
        }

        // Nhận gói dữ liệu điểm thật 100% từ Sở trả về
        const data = await response.json();
        
        // Trả dữ liệu gốc đó về cho file index.html hiển thị lên màn hình
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Lỗi hệ thống: " + error.message });
    }
}
