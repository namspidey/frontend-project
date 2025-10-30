import { useState } from 'react';
import { sendOtpToEmail } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    dob: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (Object.values(form).some((val) => !val.trim())) {
      setMessage('Vui lòng nhập đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await sendOtpToEmail(form);
      localStorage.setItem('registerInfo', JSON.stringify(form));
      navigate('/verify-otp');
    } catch (err) {
      // ❌ Không in lỗi chi tiết ra người dùng
      // ✅ Hiển thị thông báo chung
      setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau');
      console.error('Lỗi khi gửi OTP:', err); // log nội bộ để debug
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="card p-4 shadow-sm">
        <h3 className="mb-4 text-center">Đăng ký</h3>

        {['username', 'fullname', 'password', 'email', 'dob'].map((field) => (
          <div key={field} className="inputGroup">
            <input
              type={
                field === 'dob' ? 'date' :
                  field === 'password' ? 'password' : 'text'
              }
              name={field}
              required
              autoComplete="off"
              value={form[field]}
              placeholder={field === 'dob' ? ' ' : ''} // ✅ thêm dòng này
              onChange={handleChange}
            />
            <label>
              {field === 'dob'
                ? 'Ngày sinh'
                : field === 'fullname'
                  ? 'Họ và tên'
                  : field === 'username'
                    ? 'Tên đăng nhập'
                    : field === 'email'
                      ? 'Email'
                      : field === 'password'
                        ? 'Mật khẩu'
                        : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          </div>
        ))}



        {message && <p className="text-danger small">{message}</p>}

        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="btn-gra w-100"
        >
          {loading ? 'Đang gửi OTP...' : 'Tiếp tục'}
        </button>
        <p className="mt-3 text-center small">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-decoration-none">
            Quay lại đăng nhập
          </a>
        </p>
      </div>
      {/* Lưu ý (ẩn/hiện khi click) */}
      <div className="mt-3 text-center">
        <p
          style={{ cursor: 'pointer', color: '#0d00ffff', textDecoration: 'underline' }}
          onClick={() => setShowNote(!showNote)}
        >
          Lưu ý
        </p>
        {showNote && (
          <p className="small text-muted mt-2">
            Nếu phản hồi chậm, vui lòng đợi 30-60s để server khởi động
          </p>
        )}
      </div>
    </div>
  );
}
