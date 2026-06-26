// api/tracuu.js
export default async function handler(req, res) {
    // Cấu hình cho phép Frontend của bạn gọi vào cổng này không bị chặn CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const { sbd } = req.query;
    if (!sbd) {
        return res.status(400).json({ error: "Vui lòng nhập Số báo danh" });
    }

    try {
        // Địa chỉ cổng API thật của hệ thống QLGD Sở GD&ĐT Tây Ninh
        // Lưu ý: Cấu trúc endpoint này phải trùng khớp với cổng tra cứu năm nay của Sở
        const url = `https://tuyensinh.tayninh.edu.vn/api/tra-cuu/ket-qua?sbd=${sbd}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // ĐÂY LÀ MẸO ĐỒNG BỘ GIỐNG VOQUOCVIET: 
                // Giả lập Headers để hệ thống QLGD của Sở không chặn kết nối từ Vercel
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://tuyensinh.tayninh.edu.vn/',
                'Origin': 'https://tuyensinh.tayninh.edu.vn',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Cổng QLGD của Sở từ chối kết nối hoặc đang bận" });
        }

        const data = await response.json();
        
        // Trả toàn bộ cục dữ liệu gốc từ QLGD của Sở về cho file index.html xử lý
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Lỗi kết nối API: " + error.message });
    }
}
