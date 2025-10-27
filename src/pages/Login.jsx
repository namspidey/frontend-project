import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="container mt-5" style={{ maxWidth: '400px' }}>
    <div className="card p-4 shadow-sm">
      <h3 className="mb-4 text-center">Đăng nhập</h3>

      <div className="mb-3 inputGroup">
        <input
          type="text"
          required
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Tên đăng nhập</label>
      </div>

      <div className="mb-3 inputGroup">
        <input
          type="password"
          required
          autoComplete="off"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Mật khẩu</label>
      </div>

      {error && <p className="text-danger small">{error}</p>}

      <button className="w-100 btn-login" onClick={handleLogin}>
        Đăng nhập
      </button>

      <p className="mt-3 text-center small">
        Chưa có tài khoản?{' '}
        <a href="/register" className="text-decoration-none">
          Đăng ký ngay
        </a>
      </p>
    </div>
  </div>
);

}
