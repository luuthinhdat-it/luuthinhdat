// api/tracuu.js
export default async function handler(req, res) {
    // Cấu hình Header cho phép giao diện frontend kết nối không bị chặn
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const { sbd } = req.query;
    if (!sbd) {
        return res.status(400).json({ error: "Vui lòng nhập Số báo danh" });
    }

    try {
        // ĐƯỜNG DẪN API THỰC TẾ ĐẾN CỔNG CỦA SỞ GD&ĐT TÂY NINH
        const url = `https://tuyensinh.tayninh.edu.vn/api/tra-cuu/ket-qua?sbd=${sbd}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Giả lập các tham số trình duyệt giống voquocviet để hệ thống Sở chấp nhận yêu cầu
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
            return res.status(500).json({ error: "Hệ thống của Sở không phản hồi" });
        }

        // Nhận gói dữ liệu gốc chứa thông tin thật từ Sở trả về
        const data = await response.json();
        
        // Trả dữ liệu gốc đó về cho giao diện index.html hiển thị
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Lỗi kết nối API: " + error.message });
    }
}
