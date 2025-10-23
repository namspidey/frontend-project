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
      setMessage('Đăng ký thành công!');
      navigate('/login');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card p-4 shadow-sm">
        <h3 className="mb-4 text-center">Xác minh OTP</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Đang xác minh...' : 'Xác minh & Đăng ký'}
        </button>

        {message && <p className="text-danger small mt-3">{message}</p>}
      </div>
    </div>
  );
}
