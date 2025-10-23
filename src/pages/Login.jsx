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

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-danger small">{error}</p>}

        <button className="btn btn-primary w-100" onClick={handleLogin}>
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
