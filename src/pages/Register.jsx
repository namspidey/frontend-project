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

        {['username', 'fullname', 'email', 'password', 'dob'].map((field) => (
          <div key={field} className="mb-3">
            <input
              type={
                field === 'dob' ? 'date' :
                field === 'password' ? 'password' : 'text'
              }
              name={field}
              className="form-control"
              placeholder={
                field === 'dob' ? 'Ngày sinh' :
                field === 'fullname' ? 'Họ và tên' :
                field.charAt(0).toUpperCase() + field.slice(1)
              }
              onChange={handleChange}
              value={form[field]}
            />
          </div>
        ))}

        {message && <p className="text-danger small">{message}</p>}

        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="btn btn-success w-100"
        >
          {loading ? 'Đang gửi OTP...' : 'Tiếp tục'}
        </button>
      </div>
    </div>
  );
}
