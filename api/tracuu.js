// api/tracuu.js
export default async function handler(req, res) {
    const { sbd } = req.query;

    if (!sbd) {
        return res.status(400).json({ error: "Vui lòng nhập Số báo danh" });
    }

    try {
        // Gửi yêu cầu ngầm trực tiếp lên hệ thống lưu trữ của Sở GD&ĐT Tây Ninh
        const response = await fetch(`https://tuyensinh.tayninh.edu.vn/api/tra-cuu/ket-qua?sbd=${sbd}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Không thể kết nối với hệ thống của Sở" });
        }

        const data = await response.json();
        
        // Trả kết quả chính xác về cho giao diện web hiển thị
        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: "Lỗi kết nối hệ thống: " + error.message });
    }
}

