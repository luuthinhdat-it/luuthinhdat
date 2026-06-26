// api/tracuu.js
export default async function handler(req, res) {
    // Cho phép gọi từ giao diện frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { sbd } = req.query;
    if (!sbd) {
        return res.status(400).json({ error: "Vui lòng nhập Số báo danh" });
    }

    try {
        // Gọi trực tiếp vào API endpoint đang chạy của Sở GD&ĐT Tây Ninh
        const url = `https://tuyensinh.tayninh.edu.vn/api/tra-cuu/ket-qua?sbd=${sbd}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
                'Accept': 'application/json',
                'Referer': 'https://tuyensinh.tayninh.edu.vn/'
            }
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Hệ thống Sở đang bận hoặc nghẽn mạng" });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Lỗi kết nối: " + error.message });
    }
}
