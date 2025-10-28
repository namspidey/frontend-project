import { useEffect, useState } from 'react';
import { registerUser } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('registerInfo');
    if (saved) setForm(JSON.parse(saved));
    else navigate('/register');
  }, [navigate]);

  const handleSubmit = async () => {
    if (!form) return;
    try {
      setLoading(true);
      await registerUser({ ...form, otp });
      localStorage.removeItem('registerInfo');
      setMessage('✅ Đăng ký thành công. Vui lòng đăng nhập lại');
      
      // ⏳ Chờ 5 giây rồi chuyển sang login
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      // Ẩn chi tiết lỗi, hiển thị thông báo chung
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau');
      console.error('Lỗi xác minh OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card p-4 shadow-sm">
        <h3 className="mb-3 text-center">Xác minh OTP</h3>

        <p className="text-muted small mb-4 text-center">
          Hệ thống đã gửi mã OTP về email của bạn. 
          Vui lòng nhập mã OTP đã gửi để hoàn thành đăng ký.
        </p>

        <input
          type="text"
          className="form-control mb-3 text-center"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="btn-gra w-100"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Đang xác minh...' : 'Xác minh & Đăng ký'}
        </button>

        {message && (
          <p
            className={`mt-3 small text-center ${
              message.includes('thành công') ? 'text-success' : 'text-danger'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
