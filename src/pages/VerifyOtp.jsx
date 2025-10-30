import { useEffect, useState } from 'react';
import { registerUser } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // ⏳ 5 phút (300 giây)
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('registerInfo');
    if (saved) setForm(JSON.parse(saved));
    else navigate('/register');
  }, [navigate]);

  // 🕒 Đếm ngược thời gian OTP
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async () => {
    if (!form) return;
    if (timeLeft <= 0) {
      setMessage('Mã OTP đã hết hạn, vui lòng quay lại đăng ký.');
      return;
    }

    try {
      setLoading(true);
      await registerUser({ ...form, otp });
      localStorage.removeItem('registerInfo');
      setMessage('Đăng ký thành công. Vui lòng đăng nhập lại');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
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
          Vui lòng nhập mã OTP để hoàn tất đăng ký.
        </p>

        {/* Hiển thị đếm ngược hoặc hết hạn */}
        {timeLeft > 0 ? (
          <p className="text-primary text-center small mb-2">
            Mã OTP sẽ hết hạn sau: <b>{formatTime(timeLeft)}</b>
          </p>
        ) : (
          <p className="text-danger text-center small mb-2">
            Mã OTP đã hết hạn.{' '}
            <a href="/register" className="text-primary text-decoration-underline">
              Quay lại đăng ký
            </a>
          </p>
        )}

        <input
          type="text"
          className="form-control mb-3 text-center"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={timeLeft <= 0}
        />

        <button
          className="btn-gra w-100"
          onClick={handleSubmit}
          disabled={loading || timeLeft <= 0}
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
